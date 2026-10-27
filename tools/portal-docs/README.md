# Documentos do portal

Gera os PDFs dos documentos do portal do parceiro no modelo padrão dos formulários da NeuroStat (o mesmo do gerador de props:
cabeçalho com marca, código de barras e número do documento, grade de campos, seções A/B/C, tabelas com cabeçalho azul-marinho, aprovações e rodapé com QR).

- `nsforms.py`: o layout (reportlab). As medidas estão nos "pixels" do gerador (página de 460 x 650) e são escaladas para o A4.
- `doclib.py`: a definição de um documento (`D(...)`) e o código que grava o PDF e o arquivo `.md` ao lado.
- `docs_gunnar.py`, `docs_callum.py`, `docs_fossum.py`, `docs_shared.py`: os documentos de cada login e a biblioteca da empresa.
- `generate.py`: `python tools/portal-docs/generate.py [gunnar callum fossum shared]` grava em `private/portal/<conta>/`.
- `apply-defaults.mjs`: entrega ao ar os documentos novos como o pacote indica (o mesmo que o botão do painel). `--dry` só conta. `--reset-date-only` volta a data compartilhada ao padrão.

Precisa de Python com `reportlab` e `pymupdf`, e das fontes Roboto Condensed, Source Sans 3 e Courier Prime em `.ttf`
(pasta indicada em `NS_FONTS`; saem das fontes do gerador de props, convertidas com o fonttools). Depois de gerar:

1. rode `python tools/portal-docs/fix_pdf_meta.py` (limpa o autor e o produtor dos PDFs),
2. `npm run panel-bundle` (criptografa os documentos para `apps/neurostat/public/partner/lib/` e refaz o pacote do painel),
3. faça o commit, espere o deploy e rode `node tools/portal-docs/apply-defaults.mjs`.

## Documentos guardados

Os documentos listados em `held.txt` são gerados com `published: false`: ficam fora da biblioteca e do painel até alguém decidir que têm um propósito na história.
Para liberar um, tire a linha de `held.txt`, rode `generate.py` e siga os passos acima.
