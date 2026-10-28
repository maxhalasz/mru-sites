"""NeuroStat standard form layout for the portal documents (A4, reportlab).

Reproduces the form style of the props generator: letterhead with mark, barcode and document number, a
double rule, a grid of boxed fields, lettered section headings, tables with a navy header row, approval
boxes and a footer with a QR block. Measurements are written in the generator's pixels (a page is 460 x 650)
and scaled to points, so the proportions match the mock-ups.

Fonts: Roboto Condensed, Source Sans 3 and Courier Prime as .ttf files in NS_FONTS (see README.md).
"""
import io
import os
import subprocess

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Flowable, Frame, Image, NextPageTemplate, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle, KeepTogether, CondPageBreak)

W, H = A4
S = W / 460.0  # generator pixel -> point


def px(v):
    return v * S


FONT_DIR = os.environ.get('NS_FONTS', 'C:/Users/max/AppData/Local/Temp/mrutrace/fonts/ttf')
for _name, _file in [('SS', 'SourceSans3-400'), ('SS-SB', 'SourceSans3-600'), ('SS-B', 'SourceSans3-700'),
                     ('RC', 'RobotoCondensed-400'), ('RC-B', 'RobotoCondensed-700'),
                     ('CP', 'CourierPrime-400'), ('CP-B', 'CourierPrime-700')]:
    pdfmetrics.registerFont(TTFont(_name, f'{FONT_DIR}/{_file}.ttf'))
registerFontFamily('SS', normal='SS', bold='SS-B', italic='SS', boldItalic='SS-B')
registerFontFamily('CP', normal='CP', bold='CP-B', italic='CP', boldItalic='CP-B')
registerFontFamily('RC', normal='RC', bold='RC-B', italic='RC', boldItalic='RC-B')

NAVY = colors.HexColor('#14243a')
GRAYB = colors.HexColor('#5c6b7d')
LINEB = colors.HexColor('#9aa9bb')
BLUEF = colors.HexColor('#dfe8f7')
TINT = colors.HexColor('#eef2f8')
RULE = colors.HexColor('#c7d0dc')
PAPER = colors.HexColor('#fdfdfb')
INK = colors.HexColor('#17202b')
FOOT = colors.HexColor('#4d5a6a')

MX = px(24)           # side margin
CW = W - 2 * MX       # content width
FIRST_TOP = 109       # px from the top where content starts on page 1
CONT_TOP = 80         # ... on later pages
BOTTOM = 597          # px from the top where content must end

MARK = [
    [(968, 285), (692, 747), (968, 746)],
    [(959, 789), (667, 789), (411, 1224)],
    [(1010, 285), (1010, 592), (1469, 1048)],
    [(1588, 1230), (1011, 658), (1010, 806), (426, 1227), (989, 979)],
]
MARK_CIRCLE = (986.6, 1118.3, 63.9)
MARK_BOX = (411, 285, 1177, 945)


def ps(font='SS', size=7.6, lead=1.5, color=INK, **kw):
    return ParagraphStyle('s', fontName=font, fontSize=px(size), leading=px(size * lead), textColor=color, **kw)


BODY = ps(size=7.6, lead=1.45, spaceAfter=px(3.4))
CELL = ps(size=7.2, lead=1.32)
CELLM = ps('CP', 7.0, 1.35)
SMALL = ps(size=6.4, lead=1.45, color=GRAYB)
BUL = ps(size=7.6, lead=1.5, leftIndent=px(9), bulletIndent=px(1), spaceAfter=px(2))


# ---- small drawing helpers ------------------------------------------------------------------

def rng(seed):
    a = [seed & 0xFFFFFFFF]

    def nxt():
        a[0] = (a[0] + 0x6D2B79F5) & 0xFFFFFFFF
        t = ((a[0] ^ (a[0] >> 15)) * (1 | a[0])) & 0xFFFFFFFF
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & 0xFFFFFFFF)) & 0xFFFFFFFF) ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296.0
    return nxt


def seed_of(text):
    n = 7
    for ch in text:
        n = (n * 31 + ord(ch)) & 0xFFFFFFFF
    return n


def tracked_width(text, font, size, track):
    return pdfmetrics.stringWidth(text, font, size) + track * size * max(len(text) - 1, 0)


def draw_tracked(c, x, y, text, font, size, color, track=0.0, anchor='l'):
    w = tracked_width(text, font, size, track)
    if anchor == 'c':
        x -= w / 2
    elif anchor == 'r':
        x -= w
    t = c.beginText(x, y)
    t.setFont(font, size)
    t.setFillColor(color)
    t.setCharSpace(track * size)
    t.textOut(text)
    t.setCharSpace(0)  # the spacing must not leak into the text that follows
    c.drawText(t)


def draw_mark(c, x, y_top, w):
    x0, y0, vw, vh = MARK_BOX
    sx = w / vw
    c.saveState()
    c.setFillColor(NAVY)
    for poly in MARK:
        p = c.beginPath()
        for i, (X, Y) in enumerate(poly):
            fx, fy = x + (X - x0) * sx, y_top - (Y - y0) * sx
            p.moveTo(fx, fy) if i == 0 else p.lineTo(fx, fy)
        p.close()
        c.drawPath(p, stroke=0, fill=1)
    cx, cy, r = MARK_CIRCLE
    c.circle(x + (cx - x0) * sx, y_top - (cy - y0) * sx, r * sx, stroke=0, fill=1)
    c.restoreState()


def draw_barcode(c, x, y_top, w, h, seed):
    r = rng(seed)
    c.saveState()
    c.setFillColor(NAVY)
    bx = 2
    while bx < w - 2:
        bw = 1 + int(r() * 3)
        if r() < 0.78:
            c.rect(x + px(bx), y_top - px(h), px(bw), px(h), stroke=0, fill=1)
        bx += bw + (1 if r() < 0.7 else 2)
    c.restoreState()


def draw_qr(c, x, y_top, size, seed, n=25):
    r = rng(seed)
    u = size / n
    c.saveState()
    c.setFillColor(NAVY)

    def cell(ix, iy):
        c.rect(x + ix * u, y_top - (iy + 1) * u, u, u, stroke=0, fill=1)

    def finder(ox, oy):
        for yy in range(7):
            for xx in range(7):
                edge = xx in (0, 6) or yy in (0, 6)
                core = 2 <= xx <= 4 and 2 <= yy <= 4
                if edge or core:
                    cell(ox + xx, oy + yy)
    finder(0, 0)
    finder(n - 7, 0)
    finder(0, n - 7)
    for yy in range(n):
        for xx in range(n):
            if (xx < 8 and yy < 8) or (xx >= n - 8 and yy < 8) or (xx < 8 and yy >= n - 8):
                continue
            if r() < 0.48:
                cell(xx, yy)
    c.restoreState()


# ---- page furniture -------------------------------------------------------------------------

class Spec:
    """What the letterhead and footer of one document say."""

    def __init__(self, form, docno, unit, cls, title, title_right='', cont_title=None, printed='', total=1):
        self.form, self.docno, self.unit, self.cls = form, docno, unit, cls
        self.title, self.title_right = title, title_right
        self.cont_title = cont_title or title.upper()
        self.printed = printed
        self.total = total
        self.stamp = None


def draw_top_row(c, spec):
    draw_tracked(c, MX, H - px(18), spec.form, 'SS', px(5.3), GRAYB, 0.09)
    draw_tracked(c, W - MX, H - px(18), spec.cls, 'SS-B', px(5.3), NAVY, 0.09, 'r')


def draw_first(c, d):
    spec = d.spec
    c.saveState()
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_top_row(c, spec)
    draw_tracked(c, MX, H - px(33), 'DOC NO.', 'CP', px(5.2), GRAYB)
    draw_tracked(c, MX, H - px(40.5), spec.docno, 'CP-B', px(6), NAVY)
    draw_barcode(c, W - MX - px(76), H - px(25), 76, 20, seed_of(spec.docno))
    draw_mark(c, W / 2 - px(18), H - px(25), px(36))
    draw_tracked(c, W / 2, H - px(71), 'NEUROSTAT', 'RC-B', px(16), NAVY, 0.34, 'c')
    draw_tracked(c, W / 2, H - px(84), spec.unit, 'SS', px(5.4), GRAYB, 0.24, 'c')
    c.setFillColor(NAVY)
    c.rect(MX, H - px(95), CW, px(2), stroke=0, fill=1)
    c.rect(MX, H - px(97.75), CW, px(0.75), stroke=0, fill=1)
    if spec.stamp:
        w = px(60)
        c.translate(W - MX - px(44), H - px(73))
        c.rotate(-6)
        c.setFillAlpha(0.88)
        c.drawImage(spec.stamp, -w / 2, -w * 0.4525, width=w, height=w * 0.905, mask='auto')
    c.restoreState()
    draw_footer(c, d)


def draw_cont(c, d):
    spec = d.spec
    c.saveState()
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    draw_top_row(c, spec)
    draw_mark(c, MX, H - px(27), px(36))
    draw_tracked(c, MX + px(44), H - px(44), 'NEUROSTAT', 'RC-B', px(12), NAVY, 0.30)
    draw_tracked(c, MX + px(44), H - px(51), spec.unit, 'SS', px(4.8), GRAYB, 0.20)
    draw_tracked(c, W - MX, H - px(40), spec.cont_title, 'RC-B', px(10), NAVY, 0.08, 'r')
    draw_tracked(c, W - MX, H - px(48), f'{spec.docno} · SHEET {d.page} OF {spec.total}', 'CP', px(5.6), GRAYB, 0, 'r')
    c.setFillColor(NAVY)
    c.rect(MX, H - px(64), CW, px(2), stroke=0, fill=1)
    c.rect(MX, H - px(66.75), CW, px(0.75), stroke=0, fill=1)
    c.restoreState()
    draw_footer(c, d)


def draw_footer(c, d):
    spec = d.spec
    c.saveState()
    c.setStrokeColor(NAVY)
    c.setLineWidth(px(0.75))
    c.line(MX, H - px(601), W - MX, H - px(601))
    size = px(5)
    lead = px(5 * 1.55)
    avail = CW - px(12) - px(62)
    lines = simpleSplit('This document contains confidential and proprietary information of NeuroStat Org. Unauthorized '
                        'disclosure, copying or distribution is prohibited.', 'SS', size, avail) + [spec.printed]
    y = H - px(636) + px(1.8)
    c.setFillColor(FOOT)
    c.setFont('SS', size)
    for line in reversed(lines):
        c.drawString(MX, y, line)
        y += lead
    draw_tracked(c, W - MX - px(36), H - px(636) + px(9), 'PAGE', 'SS', px(5.4), GRAYB, 0, 'r')
    draw_tracked(c, W - MX - px(36), H - px(636) + px(1.5), f'{d.page} OF {spec.total}', 'SS-B', px(5.4), NAVY, 0, 'r')
    draw_qr(c, W - MX - px(30), H - px(606), px(30), seed_of(spec.docno) + d.page)
    c.restoreState()


# ---- flowables ------------------------------------------------------------------------------

class Tracked(Flowable):
    """One line of letter-spaced text."""

    def __init__(self, text, font='SS-B', size=4.8, color=GRAYB, track=0.09, align='l', lead=1.3):
        super().__init__()
        self.text, self.font, self.size, self.color, self.track, self.align = text, font, px(size), color, track, align
        self.h = self.size * lead

    def wrap(self, aw, ah):
        self.aw = aw
        return aw, self.h

    def draw(self):
        x = {'l': 0, 'c': self.aw / 2, 'r': self.aw}[self.align]
        draw_tracked(self.canv, x, self.h * 0.27, self.text, self.font, self.size, self.color, self.track, self.align)


class TitleRow(Flowable):
    def __init__(self, left, right=''):
        super().__init__()
        self.left, self.right = left, right
        self.h = px(18)

    def wrap(self, aw, ah):
        self.aw = aw
        return aw, self.h

    def draw(self):
        draw_tracked(self.canv, 0, px(4), self.left, 'RC-B', px(15), NAVY, 0.06)
        if self.right:
            draw_tracked(self.canv, self.aw, px(4), self.right, 'SS', px(6), GRAYB, 0.08, 'r')


class SecHead(Flowable):
    def __init__(self, tag, title):
        super().__init__()
        self.text = (tag + '  ' if tag else '') + title.upper()
        self.h = px(8 * 1.3 + 2)
        self.spaceBefore = px(9)
        self.spaceAfter = px(4)
        self.keepWithNext = True

    def wrap(self, aw, ah):
        self.aw = aw
        return aw, self.h

    def draw(self):
        c = self.canv
        draw_tracked(c, 0, px(3.6), self.text, 'RC-B', px(8), NAVY, 0.14)
        c.setStrokeColor(NAVY)
        c.setLineWidth(px(1))
        c.line(0, 0.5, self.aw, 0.5)


class CheckLine(Flowable):
    """Check boxes with labels on one line (wraps to more lines when needed)."""

    def __init__(self, items, size=7.0):
        super().__init__()
        self.items = items
        self.size = px(size)
        self.box = px(6.5)

    def _layout(self, aw):
        rows, x, y = [], 0, 0
        for label, on in self.items:
            w = self.box + px(3) + pdfmetrics.stringWidth(label, 'SS', self.size) + px(9)
            if x + w > aw and x > 0:
                x, y = 0, y + 1
            rows.append((x, y, label, on))
            x += w
        return rows, y + 1

    def wrap(self, aw, ah):
        self.aw = aw
        self.rows, n = self._layout(aw)
        self.h = n * px(10)
        return aw, self.h

    def draw(self):
        c = self.canv
        for x, y, label, on in self.rows:
            by = self.h - (y + 1) * px(10) + px(1.5)
            c.setStrokeColor(NAVY)
            c.setLineWidth(px(1))
            c.rect(x, by, self.box, self.box, stroke=1, fill=0)
            if on:
                c.setLineWidth(px(1.1))
                c.line(x + px(1.2), by + px(1.2), x + self.box - px(1.2), by + self.box - px(1.2))
                c.line(x + px(1.2), by + self.box - px(1.2), x + self.box - px(1.2), by + px(1.2))
            c.setFillColor(INK)
            c.setFont('SS', self.size)
            c.drawString(x + self.box + px(3), by + px(0.4), label)


class Rule(Flowable):
    def __init__(self, color=RULE, weight=0.75, gap=0):
        super().__init__()
        self.color, self.weight, self.gap = color, weight, gap

    def wrap(self, aw, ah):
        self.aw = aw
        return aw, px(self.gap) + px(1)

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(px(self.weight))
        self.canv.line(0, 0, self.aw, 0)


class StampMark(Flowable):
    """The classification stamp, slightly tilted, at the end of the document."""

    def __init__(self, png, width=118):
        super().__init__()
        self.png = png
        self.w = px(width)
        self.h = px(width * 0.905)

    def wrap(self, aw, ah):
        self.aw = aw
        return aw, self.h + px(8)

    def draw(self):
        c = self.canv
        c.saveState()
        c.translate(self.aw - self.w * 0.55, self.h * 0.5 + px(4))
        c.rotate(-6)
        c.setFillAlpha(0.9)
        c.drawImage(self.png, -self.w / 2, -self.h / 2, width=self.w, height=self.h, mask='auto')
        c.restoreState()


# ---- builders -------------------------------------------------------------------------------

def sec(tag, title):
    return SecHead(tag, title)


def p(text, style=None):
    return Paragraph(text, style or BODY)


def bullets(items, style=None):
    return [Paragraph(t, style or BUL, bulletText='•') for t in items]


def numbered(items, start=1):
    return [Paragraph(t, BUL, bulletText=f'{i}.') for i, t in enumerate(items, start)]


def gap(v=6):
    return Spacer(1, px(v))


def _cell_label(text):
    return Tracked(text, 'SS-B', 4.8, GRAYB, 0.09)


def fields(rows, number=True, min_h=None):
    """A grid of boxed fields as one table. rows: list of rows, each a list of (weight, label, value[, opts]) tuples.
    opts: mono, shade (default True), bold, check (list of (label, checked)). Rows may have different columns:
    the grid uses every column boundary found in any row and the cells span."""
    from fractions import Fraction
    bounds = {Fraction(0), Fraction(1)}
    norm = []
    for row in rows:
        total = sum(Fraction(str(c[0])) for c in row)
        acc, cells = Fraction(0), []
        for c in row:
            w = Fraction(str(c[0])) / total
            cells.append((acc, acc + w, c))
            acc += w
            bounds.add(acc)
        norm.append(cells)
    b = sorted(bounds)
    idx = {v: i for i, v in enumerate(b)}
    colw = [CW * float(b[i + 1] - b[i]) for i in range(len(b) - 1)]
    data, styles, n = [], [], 0
    for r, cells in enumerate(norm):
        line = [''] * len(colw)
        for x0, x1, cell in cells:
            label, value = cell[1], cell[2]
            o = cell[3] if len(cell) > 3 else {}
            n += 1
            lab = f'{n} · {label}' if number else label
            inner = [_cell_label(lab)]
            if o.get('check'):
                inner += [Spacer(1, px(2)), CheckLine(o['check'])]
            else:
                st = ps('CP-B' if o.get('mono') else 'SS', 7.4 if o.get('mono') else 7.6, 1.35)
                if o.get('bold'):
                    st = ps('SS-B', 7.6, 1.35)
                inner += [Spacer(1, px(1)), Paragraph(str(value), st)]
            i0, i1 = idx[x0], idx[x1] - 1
            line[i0] = inner
            if i1 > i0:
                styles.append(('SPAN', (i0, r), (i1, r)))
            if o.get('shade', True) and not o.get('check'):
                styles.append(('BACKGROUND', (i0, r), (i1, r), BLUEF))
        data.append(line)
    heights = [px(min_h) if min_h else (px(20) if all(isinstance(x, str) and not x for x in [cell[2] for cell in [c for _, _, c in norm[r]]]) and not any(len(c) > 3 and c[3].get('check') for _, _, c in norm[r]) else None) for r in range(len(data))]
    t = Table(data, colWidths=colw, rowHeights=heights)
    t.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), px(0.9), NAVY), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                           ('LEFTPADDING', (0, 0), (-1, -1), px(6)), ('RIGHTPADDING', (0, 0), (-1, -1), px(6)),
                           ('TOPPADDING', (0, 0), (-1, -1), px(3)), ('BOTTOMPADDING', (0, 0), (-1, -1), px(4))] + styles))
    return t


def table(head, rows, widths, align=None, mono=(), shade=(), total=None, bold=(), small=False, zebra=False, row_h=None):
    """Data table with a navy header row. widths are weights. align: per column 'l'/'r'/'c'."""
    ncol = len(head)
    align = align or ['l'] * ncol
    wsum = float(sum(widths))
    colw = [CW * w / wsum for w in widths]
    fs = 6.8 if small else 7.2

    def para(text, col, is_bold=False):
        a = {'l': 0, 'c': 1, 'r': 2}[align[col]]
        font = 'CP-B' if (col in mono and is_bold) else 'CP' if col in mono else 'SS-B' if is_bold else 'SS'
        color = GRAYB if col == 0 and col in mono else INK
        return Paragraph(str(text), ps(font, fs - (0.2 if col in mono else 0), 1.3, color, alignment=a))

    data = [[Tracked(h.upper(), 'RC-B', 5.6, colors.white, 0.11, {'l': 'l', 'r': 'r', 'c': 'c'}[align[i]]) for i, h in enumerate(head)]]
    for r in rows:
        data.append([para(c, i, i in bold) for i, c in enumerate(r)])
    st = [('BOX', (0, 0), (-1, -1), px(1), NAVY), ('BACKGROUND', (0, 0), (-1, 0), NAVY),
          ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), px(5)), ('RIGHTPADDING', (0, 0), (-1, -1), px(5)),
          ('TOPPADDING', (0, 0), (-1, -1), px(3)), ('BOTTOMPADDING', (0, 0), (-1, -1), px(3.2))]
    for i in range(1, len(data)):
        st.append(('LINEABOVE', (0, i), (-1, i), px(1), RULE))
        if zebra and i % 2 == 0:
            st.append(('BACKGROUND', (0, i), (-1, i), colors.HexColor('#f5f7fb')))
    for col in shade:
        st.append(('BACKGROUND', (col, 1), (col, len(data) - 1), BLUEF))
    if total:
        vals = list(total[1]) if isinstance(total[1], (list, tuple)) else [total[1]]
        k = len(vals)
        data.append([Paragraph(str(total[0]), ps('SS-B', fs, 1.3, INK, alignment=2))] + [para('', i) for i in range(1, ncol - k)]
                    + [para(v, ncol - k + i, True) for i, v in enumerate(vals)])
        n = len(data) - 1
        if ncol - k - 1 > 0:
            st.append(('SPAN', (0, n), (ncol - k - 1, n)))
        st += [('BACKGROUND', (0, n), (-1, n), TINT), ('LINEABOVE', (0, n), (-1, n), px(1.5), NAVY)]
    heights = None
    if row_h:
        heights = [None] + [px(row_h)] * len(rows) + ([None] if total else [])
    t = Table(data, colWidths=colw, rowHeights=heights, repeatRows=1)
    t.setStyle(TableStyle(st))
    return t


def kv(rows, key_w=1.0, val_w=3.6):
    """Two-column table: item and summary."""
    data = [[Tracked('ITEM', 'RC-B', 5.6, colors.white, 0.11), Tracked('SUMMARY', 'RC-B', 5.6, colors.white, 0.11)]]
    for k, v in rows:
        vv = v if isinstance(v, list) else [Paragraph(str(v), CELL)]
        data.append([Paragraph(f'<b>{k}</b>', CELL), vv])
    t = Table(data, colWidths=[CW * key_w / (key_w + val_w), CW * val_w / (key_w + val_w)], repeatRows=1)
    st = [('BOX', (0, 0), (-1, -1), px(1), NAVY), ('BACKGROUND', (0, 0), (-1, 0), NAVY), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
          ('LEFTPADDING', (0, 0), (-1, -1), px(5)), ('RIGHTPADDING', (0, 0), (-1, -1), px(5)),
          ('TOPPADDING', (0, 0), (-1, -1), px(3)), ('BOTTOMPADDING', (0, 0), (-1, -1), px(3.2)),
          ('BACKGROUND', (0, 1), (0, -1), TINT)]
    for i in range(1, len(data)):
        st.append(('LINEABOVE', (0, i), (-1, i), px(1), RULE))
    t.setStyle(TableStyle(st))
    return t


def box(content, shade=True):
    items = content if isinstance(content, list) else [Paragraph(content, ps(size=7.6, lead=1.5))]
    t = Table([[items]], colWidths=[CW])
    t.setStyle(TableStyle([('BOX', (0, 0), (-1, -1), px(1), LINEB), ('BACKGROUND', (0, 0), (-1, -1), BLUEF if shade else PAPER),
                           ('LEFTPADDING', (0, 0), (-1, -1), px(7)), ('RIGHTPADDING', (0, 0), (-1, -1), px(7)),
                           ('TOPPADDING', (0, 0), (-1, -1), px(5)), ('BOTTOMPADDING', (0, 0), (-1, -1), px(3))]))
    return t


def approvals(items, title=None):
    """items: list of (role, name, stamp). A pending approval has an empty name. title adds a heading kept with the boxes."""
    n = len(items)
    top = [Tracked(role, 'SS-B', 5.2, GRAYB, 0.08) for role, _, _ in items]
    body = []
    for role, name, stamp in items:
        if name:
            body.append([Paragraph(f'<b>{name.upper()}</b>', ps(size=6.4, lead=1.3)), Paragraph(stamp, ps('CP', 6.0, 1.3, GRAYB))])
        else:
            body.append([Paragraph('PENDING', ps(size=6.4, lead=1.3)), Paragraph('— / — / —', ps('CP', 6.0, 1.3, GRAYB))])
    t = Table([top, body], colWidths=[CW / n] * n, rowHeights=[None, px(26)])
    t.setStyle(TableStyle([('BOX', (0, 0), (-1, -1), px(1), NAVY), ('LINEAFTER', (0, 0), (-2, -1), px(1), NAVY),
                           ('BACKGROUND', (0, 0), (-1, 0), TINT), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                           ('LEFTPADDING', (0, 0), (-1, -1), px(6)), ('RIGHTPADDING', (0, 0), (-1, -1), px(6)),
                           ('TOPPADDING', (0, 0), (-1, 0), px(3)), ('BOTTOMPADDING', (0, 0), (-1, 0), px(3)),
                           ('TOPPADDING', (0, 1), (-1, 1), px(5))]))
    return KeepTogether([SecHead('', title), t] if title else [t])


def use_only(title, items):
    """The dashed 'for office use only' strip."""
    n = len(items)
    t = Table([[Tracked(title, 'SS-B', 5.4, GRAYB, 0.1)] + [''] * (n - 1),
               [Paragraph(i, ps(size=6.2, lead=1.3, color=GRAYB)) for i in items]], colWidths=[CW / n] * n)
    t.setStyle(TableStyle([('BOX', (0, 0), (-1, -1), 0.6, GRAYB, None, (2, 2)), ('SPAN', (0, 0), (-1, 0)),
                           ('LEFTPADDING', (0, 0), (-1, -1), px(7)), ('TOPPADDING', (0, 0), (-1, -1), px(3)),
                           ('BOTTOMPADDING', (0, 0), (-1, -1), px(3))]))
    return KeepTogether([t])


def sign_lines(labels):
    n = len(labels)
    t = Table([[''] * n, [Tracked(l, 'SS-B', 4.8, GRAYB, 0.09) for l in labels]], colWidths=[CW / n] * n, rowHeights=[px(24), None])
    t.setStyle(TableStyle([('LINEBELOW', (0, 0), (-1, 0), px(0.9), NAVY), ('LEFTPADDING', (0, 0), (-1, -1), 0),
                           ('RIGHTPADDING', (0, 0), (-1, -1), px(14)), ('TOPPADDING', (0, 1), (-1, 1), px(2))]))
    return KeepTogether([t])


def stamp_png(text, cache):
    os.makedirs(cache, exist_ok=True)
    slug = ''.join(ch if ch.isalnum() else '-' for ch in text.lower()).strip('-')
    out = f'{cache}/{slug}.png'
    if not os.path.exists(out):
        subprocess.run(['node', 'packages/brand/bin/stamp.mjs', text, out, '--width', '700'], check=True)
    return out


class _Doc(BaseDocTemplate):
    pass


def build_pdf(path, spec, story_fn, title='', author='NeuroStat Holding AG'):
    """Builds twice: the first pass counts the pages for the 'PAGE x OF y' text."""
    for total in (1, None):
        buf = io.BytesIO() if total else open(path, 'wb')
        d = _Doc(buf, pagesize=A4, title=title or spec.title, author=author, leftMargin=MX, rightMargin=MX)
        d.spec = spec
        if total:
            spec.total = total
        f1 = Frame(MX, H - px(BOTTOM), CW, px(BOTTOM - FIRST_TOP), leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id='f1')
        f2 = Frame(MX, H - px(BOTTOM), CW, px(BOTTOM - CONT_TOP), leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id='f2')
        d.addPageTemplates([PageTemplate(id='first', frames=[f1], onPage=draw_first, autoNextPageTemplate='cont'),
                            PageTemplate(id='cont', frames=[f2], onPage=draw_cont)])
        d.build(story_fn())
        if total:
            spec.total = max(d.page, 1)
        else:
            buf.close()
    return spec.total
