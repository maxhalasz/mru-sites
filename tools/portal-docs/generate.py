"""Builds the portal documents: python generate.py [account ...]  (run from the repository root)."""
import importlib
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doclib

MODULES = ['docs_gunnar', 'docs_callum', 'docs_fossum', 'docs_shared']
want = set(sys.argv[1:])
for m in MODULES:
    if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), m + '.py')):
        importlib.import_module(m)
n = 0
for d in doclib.REGISTRY:
    if want and d.account not in want:
        continue
    pages = d.build()
    n += 1
    print(f'{d.account:7} {d.number:24} {pages} p  {d.title}')
print(n, 'documents')
