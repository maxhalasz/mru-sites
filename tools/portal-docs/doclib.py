"""Document definitions for the portal and the code that turns them into PDFs and front-matter files."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from nsforms import *  # noqa: F401,F403
import nsforms as F

ROOT = 'C:/Users/max/mru-sites'
PRIV = ROOT + '/private/portal'
STAMPS = 'C:/Users/max/AppData/Local/Temp/mrutrace/stamps'
MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
MONL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


def dmy(iso):
    y, m, d = iso.split('-')
    return f'{int(d)} {MON[int(m) - 1]} {y}'


def long(iso):
    y, m, d = iso.split('-')
    return f'{int(d)} {MONL[int(m) - 1]} {y}'


REGISTRY = []


class D:
    """One portal document. body() returns the flowables after the field grid."""

    def __init__(self, account, slug, title, number, date, cls, stamp, desc, folder, form, formname, unit, body,
                 rows=None, appr=None, hdr_right=None, unit_short=None, pages_note=None):
        self.__dict__.update(locals())
        del self.__dict__['self']
        REGISTRY.append(self)

    def spec(self):
        hdr = self.cls.upper().replace(', ', ' — ')
        sp = Spec(self.form, self.number, self.unit.upper(), hdr_right_for(hdr), self.formname.upper(),
                  self.unit_short or '', cont_title=self.formname.upper(),
                  printed=f'Issued {dmy(self.date)} · NeuroStat Document Management System v4.2')
        sp.stamp = stamp_png(self.stamp, STAMPS)
        return sp

    def story(self):
        s = [TitleRow(self.formname.upper(), self.unit_short or ''), gap(9)]
        if self.rows:
            s.append(fields(self.rows))
        s += self.body()
        if self.appr:
            s += [gap(2), approvals(self.appr, 'Issued and approved')]
        out = []
        for f in s:
            if isinstance(f, SecHead):
                out.append(CondPageBreak(px(70)))
            out.append(f)
        return out

    def build(self):
        out = f'{PRIV}/{self.account}/files'
        os.makedirs(out, exist_ok=True)
        path = f'{out}/{self.slug}.pdf'
        n = build_pdf(path, self.spec(), self.story, title=self.title)
        meta = f'{PRIV}/{self.account}/{self.slug}.md'
        lines = ['---', f'title: "{self.title}"', f'number: "{self.number}"', f'date: "{self.date}"', f'classification: "{self.cls}"',
                 f'stamp: "{self.stamp}"', 'description: "' + self.desc.replace('"', '\\"') + '"', f'file: "files/{self.slug}.pdf"']
        if self.folder:
            lines.append(f'folder: "{self.folder}"')
        held = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'held.txt')
        is_held = os.path.exists(held) and f'{self.account}/{self.slug}' in open(held).read().split()
        lines += ['published: false' if is_held else 'published: true', '---', '']
        open(meta, 'w', encoding='utf-8').write('\n'.join(lines))
        return n


def hdr_right_for(h):
    return h


def esig(name, iso, hhmm):
    return (name, f'{dmy(iso)[:-5]} {hhmm} · e-sig')
