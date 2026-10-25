# Como editar os sites (sem código)

Você mexe só no repositório privado `mru-sites`. Cada vez que você salva, o GitHub refaz os dois sites sozinho em 1 a 2 minutos e publica cada um no endereço dele:

- NeuroStat: https://neurostat-group.github.io
- Kelvara: https://kelvarapetro.github.io

Antes do lançamento os dois repositórios publicados são privados, então ninguém de fora vê nada.

## 1. Entrar no editor (Pages CMS)

1. Abra https://app.pagescms.org e entre com a sua conta do GitHub (`maxhalasz`).
2. Na primeira vez, o Pages CMS pede para instalar o app dele na sua conta. Escolha o repositório `mru-sites` (repositório privado funciona se ele estiver na lista de repositórios autorizados).
3. Abra `mru-sites`. A barra lateral mostra as coleções: **NeuroStat · Newsroom**, **Kelvara · News (NO + EN)**, **Portal · Gunnar** e assim por diante.

Se o Pages CMS não abrir o repositório, use o plano B no fim deste guia. O resultado é o mesmo.

## 2. Postar uma notícia

**NeuroStat.** Coleção "NeuroStat · Newsroom" → **Add an entry**. Preencha título, data, categoria, resumo e texto. Salve.

**Kelvara.** Coleção "Kelvara · News (NO + EN)" → **Add an entry**. Os campos de norueguês e inglês ficam um ao lado do outro. Preencha os dois, senão a notícia aparece sem tradução. Salve.

Regras:
- A data não pode passar de **19 de outubro de 2028**. Notícia com data depois disso não aparece (é o "hoje" do site).
- A Kelvara não aparece em notícia nenhuma do site da NeuroStat.
- Para esconder uma notícia sem apagar, desmarque **Published**.

## 3. Trocar uma foto

1. Veja em `docs/IMAGENS.md` o nome exato do arquivo (por exemplo `portrait-marcus-holt.jpg`).
2. No Pages CMS, abra a mídia "NeuroStat images" (ou "Kelvara images") e envie a foto **com esse nome exato**.
3. Salve. Quando o arquivo existe com esse nome, o site usa a foto no lugar da arte provisória.

Sem Pages CMS: no GitHub, entre em `apps/neurostat/public/img` (ou `apps/kelvara/public/img`) → **Add file → Upload files**.

Cuidado: tudo que vai para essas pastas fica público depois do lançamento. Sem nome real, sem metadados de câmera com localização, sem foto que não seja sua ou de banco livre.

## 4. Subir um documento no portal

Cada conta tem a sua coleção: "Portal · Gunnar MacKenzie", "Portal · Callum Reid" e "Portal · Dr. Nils Fossum".

1. Abra a coleção da conta → **Add an entry**.
2. Preencha:
   - **Title** e **Document number**
   - **Date**
   - **Classification** (aparece na lista, por exemplo "Confidential, installation managers")
   - **Stamp text**: o texto que vai **abaixo da linha do carimbo** do documento. Se deixar vazio, usa a classificação em maiúsculas. O carimbo aparece ao lado do documento no portal.
   - **Short description**
   - **File**: o PDF ou imagem. O Pages CMS envia para a pasta certa.
   - Na conta do Fossum, escolha também a **Folder** (por exemplo "Monthly assessments" para as avaliações).
3. Salve. Em 1 a 2 minutos o documento está criptografado e no portal.

**Avaliações do Fossum.** Gere o PDF no seu gerador de props, suba na conta "Dr. Nils Fossum", pasta "Monthly assessments". Uma entrada por avaliação. Para que a pasta apareça sem documentos, ela já tem uma mensagem de "nenhuma avaliação arquivada".

O texto aberto dos documentos fica só no repositório privado. O site publicado recebe apenas o pacote criptografado.

## 5. Gerar o carimbo para os seus próprios props

O carimbo "NEUROSTAT / USO INTERNO · NÍVEL N3" pode ser gerado com qualquer texto na linha de baixo, em SVG ou PNG transparente. No terminal, dentro da pasta do projeto:

```
npm run stamp -- "CONFIDENCIAL · NÍVEL N4" carimbo.png --width 1200
```

Opções: `--color #a3202a` (cor), `--tilt 0` (carimbo reto).

## 6. Criar uma conta nova no portal

Não dá para fazer só pelo formulário, mas são três passos curtos no site do GitHub (botão do lápis em cada arquivo):

1. Em `private/credentials`, acrescente uma linha: `usuario` TAB `senha` TAB `pasta`. O espaço entre os campos precisa ser um TAB. A `pasta` é o nome da pasta da conta.
2. Crie `private/portal/<pasta>/account.yml` com `name`, `role` e `welcome` (copie de uma conta existente).
3. Para editar os documentos pelo Pages CMS, copie um bloco `portal-...` do arquivo `.pages.yml` e troque o nome da pasta.

## 7. Mudar uma senha

Abra `private/credentials` no GitHub, edite a senha da linha do usuário e salve. O próximo build refaz o pacote criptografado. **Quem tinha a senha antiga deixa de entrar.** Lembre de atualizar o prop impresso.

## 8. Despublicar algo

Em qualquer coleção, abra o item e desmarque **Published**. O item some do site e da busca. Para trazer de volta, marque de novo.

## 9. Virar o site para uma campanha nova

O site mostra o "hoje" da campanha: 19 de outubro de 2028. Para avançar:

1. Troque a data nestes dois arquivos (procure `SITE_DATE`): `apps/neurostat/src/data/util.ts` e `apps/kelvara/src/i18n.ts`. O ano do rodapé acompanha.
2. Atualize a cotação: `apps/neurostat/src/data/stock.ts` (último preço e data na lista `anchors`).
3. Despublique o que não vale mais e crie notícias novas com datas novas.
4. Revise textos que falam de "hoje" (por exemplo a seção "Careers" e o calendário financeiro).

## 10. Rodar na sua máquina

```
npm install
npm run dev:neurostat    # http://localhost:4321
npm run dev:kelvara      # http://localhost:4322
npm run build            # gera tudo e roda as checagens de segurança
```

Para ver o portal funcionando localmente depois do `npm run build`, rode `npx -w @mru/neurostat astro preview`. O portal só existe no site já buildado.

## 11. Endereços no ar e lançamento

Os dois sites já estão no ar, abertos de qualquer computador, em:

- https://neurostat-group.github.io
- https://kelvarapetro.github.io

Enquanto não for o lançamento de verdade, os dois pedem ao Google para **não listar** as páginas (`noindex`, e o `robots.txt` bloqueia tudo). Quem tem o link abre, mas a busca não mostra.

No dia do lançamento:

1. Em `apps/neurostat/src/data/launch.ts` e `apps/kelvara/src/launch.ts`, troque `PUBLIC_LAUNCH = false` por `true`. Isso tira o `noindex` e abre o `robots.txt` (bloqueando só `/partner/` e a busca na NeuroStat).
2. Salve. Em alguns minutos o deploy refaz os dois sites.

Depois do lançamento, qualquer jogador pode ver os arquivos e o histórico dos repositórios publicados. Por isso a Action roda a checagem de vazamento antes de publicar, e cada publicação recria o histórico com uma única mensagem neutra.

## 12. Ver o que os jogadores enviam

Candidaturas da Kelvara, formulários de contato, respostas do BOREAS-2, inscrições e tentativas de entrar no portal vão para uma planilha do Google que só você vê. A configuração (5 minutos) e o que cada aba guarda estão em [`REGISTRO.md`](REGISTRO.md). Sem essa configuração, nada é salvo.

## Plano B (sem o Pages CMS)

Tudo que o CMS faz dá para fazer pelo site do GitHub: abra o arquivo na pasta certa, clique no lápis e salve, ou use **Add file → Upload files**.

| O que | Onde |
| --- | --- |
| Notícias NeuroStat | `apps/neurostat/src/content/news` |
| Produtos, pipeline, estudos, liderança, vagas, relatórios | `apps/neurostat/src/content/...` |
| Notícias, depoimentos e vagas da Kelvara | `apps/kelvara/src/content/...` |
| Documentos do portal | `private/portal/<conta>` |
| Senhas do portal | `private/credentials` |
