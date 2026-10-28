import glob
import json
import os

import pymupdf
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate

NAVY = colors.HexColor("#14243a")
SLATE = colors.HexColor("#5c6b7d")
ROOT = "" + os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")) + "/apps/neurostat"
OUT = ROOT + "/public/docs"
H1 = ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=20, leading=24, textColor=NAVY, spaceAfter=8)
H2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=12.5, leading=16, textColor=NAVY, spaceBefore=12, spaceAfter=4)
P = ParagraphStyle("p", fontName="Helvetica", fontSize=10, leading=14.5, textColor=colors.HexColor("#1b2a3f"), spaceAfter=6)
SM = ParagraphStyle("sm", parent=P, fontSize=8.5, leading=12, textColor=SLATE)
BUL = ParagraphStyle("b", parent=P, leftIndent=12, bulletIndent=2)


def deco(title, ref, date):
    def f(c, d):
        w, h = d.pagesize
        c.saveState()
        c.setFillColor(NAVY)
        c.rect(0, h - 14 * mm, w, 14 * mm, stroke=0, fill=1)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(20 * mm, h - 9 * mm, "NEUROSTAT")
        c.setFont("Helvetica", 8.5)
        c.drawRightString(w - 20 * mm, h - 9 * mm, title)
        c.setFillColor(SLATE)
        c.setFont("Helvetica", 8)
        c.drawString(20 * mm, 10 * mm, f"NeuroStat Holding AG · Thurgauerstrasse 66, 8050 Zürich · {ref} · {date}")
        c.drawRightString(w - 20 * mm, 10 * mm, f"Page {d.page}")
        c.restoreState()
    return f


def fm(path):
    head = open(path, encoding="utf-8").read().split("---")[1]
    d = {}
    for line in head.strip().splitlines():
        k, v = line.split(": ", 1)
        d[k] = json.loads(v) if v[:1] in '"[' else int(v) if v.isdigit() else v
    return d


def art(t):
    """'a' or 'an' in front of a class name ('wearable EEG device' -> 'a wearable EEG device')."""
    if t.lower().startswith("software"):
        return t[0].lower() + t[1:]
    return ("an " if t[0].lower() in "aeiou" else "a ") + t[0].lower() + t[1:]


for f in sorted(glob.glob(ROOT + "/src/content/products/*.md")):
    slug = os.path.basename(f)[:-3]
    d = fm(f)
    med = d["kind"] == "Medicine"
    title = ("Package leaflet: " if med else "Instructions for use: ") + d["name"]
    name = d["name"]
    s = [Paragraph(title, H1),
         Paragraph(f"{name} ({d['generic']})" if med else name, P),
         Paragraph("Read all of this document carefully before you start. Keep it: you may need to read it again. If you have further questions, ask your doctor, pharmacist or occupational health service.", P),
         Paragraph(f"1. What {name} is" + (" and what it is used for" if med else ""), H2),
         Paragraph(f"{name} is {art(d['drugClass'])}. It is intended for: {d['indication'][0].lower() + d['indication'][1:]}.", P),
         Paragraph("How it works", H2), Paragraph(d["how"], P),
         Paragraph("2. What you need to know before you use it" if med else "2. Before you use it", H2)]
    for x in d["safety"]:
        s.append(Paragraph(x, BUL, bulletText="•"))
    s += [Paragraph("3. Reporting problems", H2),
          Paragraph("If you notice any side effect or problem, talk to your doctor, pharmacist or occupational health service. You can also report it to your national authority and to NeuroStat at safety@neurostat.com. Reporting helps provide more information on the safety of this product.", P),
          Paragraph("4. About this document", H2),
          Paragraph((f"Marketing authorisation holder: NeuroStat Holding AG, Thurgauerstrasse 66, 8050 Zürich, Switzerland. First approved {d['approved']}. Last revised September 2028." if med
                     else f"Manufacturer: NeuroStat Diagnostics AG, Basel, a company of the NeuroStat group. Marketing responsibility: NeuroStat Holding AG, Thurgauerstrasse 66, 8050 Zürich, Switzerland. Launched {d['approved']}. Last revised September 2028."), SM)]
    path = f"{OUT}/{slug}-leaflet.pdf"
    doc = SimpleDocTemplate(path, pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm, topMargin=26 * mm, bottomMargin=20 * mm, title=title, author="NeuroStat Holding AG")
    fn = deco(title, f"NS-PL-{slug.upper()}", "September 2028")
    doc.build(s, onFirstPage=fn, onLaterPages=fn)
    m = pymupdf.open(path)
    tool = "NeuroStat Holding AG Document Services"
    m.set_metadata({"title": title, "author": "NeuroStat Holding AG", "subject": "", "keywords": "", "creator": tool, "producer": tool,
                    "creationDate": "D:20280901090000+02'00'", "modDate": "D:20280901090000+02'00'"})
    m.save(path + ".tmp", garbage=3, deflate=True)
    m.close()
    os.replace(path + ".tmp", path)
    print("leaflet", slug)
