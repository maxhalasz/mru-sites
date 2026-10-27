"""Cleans the metadata of the generated portal PDFs: the author and producer name the issuing company only, and the
dates inside the file are the document's own date, not the day it was generated."""
import glob
import os
import re

import pymupdf

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
n = 0
for f in glob.glob(f'{ROOT}/private/portal/*/files/*.pdf'):
    f = f.replace('\\', '/')
    md = f.replace('/files/', '/')[:-4] + '.md'
    doc = pymupdf.open(f)
    meta = doc.metadata or {}
    author = 'NeuroStat Holding AG'
    tool = f'{author} Document Services'
    m = re.search(r'date: "(\d{4})-(\d{2})-(\d{2})"', open(md, encoding='utf-8').read()) if os.path.exists(md) else None
    stamp = f"D:{m.group(1)}{m.group(2)}{m.group(3)}090000+01'00'" if m else (meta.get('creationDate') or '')
    doc.set_metadata({'title': meta.get('title') or '', 'author': author, 'subject': '', 'keywords': '', 'creator': tool, 'producer': tool,
                      'creationDate': stamp, 'modDate': stamp})
    tmp = f + '.tmp'
    doc.save(tmp, garbage=3, deflate=True)
    doc.close()
    os.replace(tmp, f)
    n += 1
print('pdf metadata cleaned:', n)
