# Pitch — Sites da NeuroStat e da Kelvara

22 de outubro de 2026 · Max

## Visão geral

Dois sites públicos que precisam parecer completamente reais: o da NeuroStat Holding AG, biofarmacêutica listada na bolsa suíça, e o da Kelvara Petrochemicals AS, a petroleira norueguesa que opera a plataforma Ødemark A. Os dois são props da campanha de Call of Cthulhu "O Deserto", que se passa em outubro de 2028, e fazem parte do universo compartilhado do Max (MRU). Os jogadores navegam neles entre sessões e às vezes na mesa.

O site da NeuroStat é um repositório contínuo. Os jogadores vão voltar nele de campanha em campanha, então ele cresce com o tempo, e o Max precisa editar texto e subir documento sem escrever código.

Como os jogadores chegam:

- Uma URL impressa num prop leva ao site da NeuroStat. Dois jogadores (Erik e Julio) já conhecem o site antes da campanha começar.
- Do site da NeuroStat eles chegam na Kelvara por dois caminhos: a página do estudo clínico BOREAS-2 e uma vaga em Carreiras.
- O anúncio de que a NeuroStat comprou a Kelvara existe só no site da Kelvara.

O que o Claude Code entrega:

- Um repositório fonte privado com os dois sites, estáticos, em Astro.
- Deploy automático pra duas organizações do GitHub, cada empresa no seu endereço.
- Edição sem código pelo Pages CMS.
- Um portal com login e conteúdo criptografado, formulários automáticos e pistas no código-fonte.
- Os textos in-world, seguindo este pitch.

A regra que vale pro projeto inteiro: nome novo, objeto novo ou escolha temática que este pitch não fixa, o Claude Code pergunta pro Max antes, sempre com pelo menos cinco opções diferentes pra ele combinar.

## Canon que os sites usam

Os sites mostram o estado de meados de outubro de 2028. O jornal que abre a campanha é de 20 de outubro de 2028, então nada no site tem data depois de 19 de outubro de 2028. O ano no rodapé é 2028.

### NeuroStat Holding AG

| Assunto | O que é público | Canon secreto (nunca vai pro site) |
| --- | --- | --- |
| Empresa | Biofarmacêutica listada na SIX Swiss Exchange, ticker NEUS, sede em Zurique | Localiza e reabre o legado operacional da DRE. Boa parte da ciência dela vem de pesquisa anômala, usada pra resolver perguntas abertas de bioquímica e neurociência e virar remédio e estudo clínico |
| Fundação | 2003, em Zurique, cofundada pelo Dr. Adriond Fisher com um grupo de clínicos. Nenhuma foto e nenhuma bio dele | Fisher é um dos fundadores e alguém importante até hoje |
| Comando | CEO Alessandro Ferri-Lutz, ítalo-suíço de família rica, coleciona relógio, nunca foi cientista | Figura decorativa. Amigo próximo de um membro da Diretoria sem rosto, que manda de verdade, e aceitou o cargo pelo luxo. A Diretoria nunca aparece |
| Diretoria executiva | CFO Rafael Steinmetz · CSO Dr. Felix Haldane · CMO Dr. Claire Dumont · General Counsel Dr. Samuel Okonkwo | Cargos distribuídos no pitch, o Max pode trocar |
| Marcus Holt | Head of Clinical Field Operations, na liderança ampliada | Chefe da Field Division. Sabe o que aconteceu com o Elias Meyer |
| Aegis Corporation | Listada entre as empresas do grupo, com serviços de segurança e logística que não citam a NeuroStat. O link vai pra um domínio que não existe | Braço operacional mais externo da NeuroStat |
| NeuroStat Org. | Nome da intranet e do portal de parceiros | Nome que já aparece nos documentos internos impressos |
| Kelvara | Citada só no estudo BOREAS-2 e numa vaga de Carreiras, como parceira. A compra não tem comunicado no site da NeuroStat | Dona da Kelvara desde 2011, por meio dos investidores |

Termos que aparecem sem explicação nos documentos do portal, que o Gunnar acha que são nomes de outros projetos: **Verdugo**, **Cinza** e **Cardume** como nomes de contrato em linhas de orçamento e logística, **NOETIC** como código de categoria, e **Legacy Sites** como nome de programa num cabeçalho de orçamento, com Ødemark A listada nele. Pro Max: Verdugo extrai espécime vivo, Cinza limpa local e neutraliza testemunha, Cardume é escolta, NOETIC é a classe de anomalia de conhecimento da NeuroStat, Legacy Sites é o programa de reabrir instalações da DRE. Nada disso é explicado em lugar nenhum do site.

### Kelvara Petrochemicals AS

| Assunto | O que é público | Canon secreto |
| --- | --- | --- |
| Registro | Org.nr. 921 447 306 MVA · Postboks 2217 Sentrum, N-4001 Stavanger, igual aos documentos impressos | O dígito verificador desse org.nr. é inválido, então não bate com nenhuma empresa real. Manter |
| Sede e operação | Sede em Stavanger. Base de apoio em Ågotnes. Ågotnes Væskeanlegg, planta de fluidos de perfuração ao lado da base. Opera Ødemark A | — |
| Fundação | 2011, por Sundvor Partners AS, pra comprar e reativar Ødemark A. A história pública começa aqui | A NeuroStat descobriu a plataforma em 2010. A Sundvor era ligada a ela e a Kelvara sempre foi da NeuroStat |
| Dono | Desde 24 de setembro de 2028, 100% da NeuroStat Holding AG. Está escrito na página de propriedade | A compra é a NeuroStat tirando a máscara |
| Liderança | Administrerende direktør Eirik Sandvold · Finansdirektør Siri Østrem · Driftsdirektør Lars Kvamme · HMS-direktør Marit Fjeldstad | Cargos distribuídos no pitch, o Max pode trocar |
| Gente dos documentos impressos | C. Vance (Logistics Coordinator), M. Krog (HSE) e Capt. H. Sæther (MS Nordvakt) podem aparecer como contato | — |
| Elenco do Deserto | Só três depoimentos: Gunnar MacKenzie, Del Carbone e Sofie Aune. Nenhum outro nome do elenco aparece | — |
| Ødemark A | Plataforma Condeep de base de gravidade em concreto, 303 m de lâmina d'água, topside de 114 × 55 m em três níveis, feita pra 196 pessoas e operada com tripulação enxuta. Rotação longa de inverno a partir de 1º de novembro | A história antes de 2011 nunca aparece. O nome antigo da plataforma ainda não existe no canon |

Elias Meyer, irmão gêmeo do Erik dado como morto desde a infância, aparece só atrás do login, num relatório que o Gunnar recebeu: "recovered", status "retained", e hoje contratado independente da NeuroStat. Isso pode virar plot da próxima campanha, então o documento não diz nada além disso.

## Repositório, hospedagem e deploy

Um repositório privado guarda tudo, e uma GitHub Action publica cada site na sua organização do GitHub Pages. Sem Firebase, sem servidor e sem banco de dados: login e formulários rodam no navegador.

```
Max edita (Pages CMS ou site do GitHub)
        │
        ▼
mru-sites  (repositório privado: código, textos, PDFs, notas, portal em texto aberto)
        │
        ▼
GitHub Action  (builda os dois sites, criptografa o portal, checa vazamento)
        ├──► neurostat-group/neurostat-group.github.io  → https://neurostat-group.github.io
        └──► kelvarapetro/kelvarapetro.github.io        → https://kelvarapetro.github.io
```

O Max só mexe no repositório privado. Os jogadores só enxergam os dois repositórios públicos, depois do lançamento.

| Peça | Nome | Visibilidade | Pra quê |
| --- | --- | --- | --- |
| Repositório fonte | `mru-sites`, na conta pessoal do Max | Privado sempre | Código, textos, PDFs, notas de mestre, conteúdo do portal em texto aberto |
| Organização da NeuroStat | `neurostat-group` | Pública | Site em https://neurostat-group.github.io |
| Repositório publicado | `neurostat-group/neurostat-group.github.io` | Privado até o lançamento, depois público | Só recebe o site pronto |
| Organização da Kelvara | `kelvarapetro` | Pública | Site em https://kelvarapetro.github.io |
| Repositório publicado | `kelvarapetro/kelvarapetro.github.io` | Privado até o lançamento, depois público | Só recebe o site pronto |

O repositório publicado precisa ter exatamente o nome `<organização>.github.io`. É isso que faz o site abrir na raiz do endereço, sem subpasta.

Passo a passo que o Max faz no navegador. O Claude Code explica de novo na hora, com os comandos prontos:

1. Conferir se `neurostat-group` e `kelvarapetro` estão livres e criar as duas organizações no plano Free.
2. Em cada organização, criar o repositório `<organização>.github.io` vazio e privado.
3. Criar o repositório privado `mru-sites` na conta pessoal.
4. Gerar dois pares de chave de deploy. A chave pública vai em cada repositório publicado, em Settings → Deploy keys, com permissão de escrita. A chave privada vai em `mru-sites`, em Settings → Secrets, como `NEUROSTAT_DEPLOY_KEY` e `KELVARA_DEPLOY_KEY`.
5. No lançamento: tornar os dois repositórios publicados públicos e, em cada um, Settings → Pages → Deploy from a branch → `gh-pages`, pasta raiz. GitHub Pages grátis só funciona com repositório público, e até esse dia ninguém de fora vê nada.

O que a Action faz a cada push na `main` de `mru-sites`: instala, builda os dois sites, criptografa o portal, roda a checagem de vazamento e publica cada pasta pronta na branch `gh-pages` do repositório certo (por exemplo com `peaceiris/actions-gh-pages`, usando `external_repository` e `deploy_key`). O commit publicado usa autor e mensagem neutros de empresa, porque o histórico fica visível.

Cuidado com o que é público: depois do lançamento, qualquer jogador pode abrir o repositório publicado no github.com e ler os arquivos e o histórico. Tudo que vai pra lá conta como visto. Nada de nota de mestre, rascunho, texto aberto do portal, nome real, source map ou caminho de pasta pessoal.

Realismo das organizações: avatar com o logo, nome de exibição ("NeuroStat Holding AG", "Kelvara Petrochemicals AS"), descrição curta, local (Zürich, Stavanger), link do site, a participação do Max marcada como privada e nenhum outro repositório público.

Estrutura sugerida:

```
mru-sites/
  apps/neurostat/          Astro, inglês
  apps/kelvara/            Astro, norueguês na raiz e inglês em /en/
  packages/portal/         criptografia no build e tela de login no navegador
  private/portal/<conta>/  documentos do portal em texto aberto (nunca publicado)
  private/credentials      usuários e senhas do portal (nunca publicado)
  docs/                    PITCH.md, IMAGENS.md, COMO-EDITAR.md, NOTAS-DO-MESTRE.md
  .pages.yml               configuração do Pages CMS
  .github/workflows/deploy.yml
```

Pra rodar local: Node LTS, `npm install` e um comando de dev por site. Astro em modo estático, fontes da marca servidas pelo próprio site (Fontsource), zero analytics e zero script de terceiros. O Claude Code confere as versões atuais antes de começar.

## Edição sem código

O Max edita tudo pelo Pages CMS (pagescms.org): entra com a conta do GitHub, escolhe o repositório `mru-sites` e vê formulários no lugar de código. Cada vez que ele salva, a Action republica o site em um ou dois minutos.

O Claude Code configura o `.pages.yml` com uma coleção por tipo de conteúdo:

- NeuroStat: notícias, produtos, pipeline, estudos clínicos, publicações, liderança, vagas e relatórios de investidor com upload de PDF.
- Kelvara: notícias com campos lado a lado em norueguês e inglês, depoimentos, vagas e documentos.
- Portal: documentos por conta (Gunnar, Callum, Fossum). Cada documento tem título, número, data, classificação, uma descrição curta e o arquivo, PDF ou imagem.

As avaliações do Fossum são o caso principal. O Max gera cada avaliação no gerador de props dele, no padrão de avaliação psicológica e física, e sobe o PDF na conta "Fossum" do portal. O build criptografa sozinho.

Todo item de conteúdo tem `date` e `published`. Pra mudar o site entre campanhas, o Max cria, edita ou despublica itens. Item despublicado some do site e da busca.

Plano B sem CMS: subir o arquivo pela própria interface do GitHub (Add file → Upload files) na pasta certa. O efeito é o mesmo.

O Claude Code escreve `docs/COMO-EDITAR.md` em português, com o passo a passo pra postar notícia, trocar foto, subir documento no portal, criar conta nova no portal, mudar senha, despublicar algo e virar o site pra uma campanha nova. Antes disso ele confere na documentação atual do Pages CMS se repositório privado e upload de arquivo funcionam como está descrito aqui.

## Site da NeuroStat

O visual é gente em lugar extremo: fotos grandes de pessoas trabalhando no frio, no escuro e isoladas (estação polar, plataforma offshore, base militar, plantão noturno), com a calma de uma farmacêutica europeia regulada. A marca já existe e manda no visual.

| Elemento | Valor |
| --- | --- |
| Logo | Triângulo facetado com um ponto embaixo, mais a palavra NEUROSTAT com espaçamento de 0.34em. Existe como imagem na tela "Documentos de Marca"; o Max manda o arquivo e o Claude Code redesenha em SVG fiel |
| Cores | Azul-marinho #14243a, ardósia #5c6b7d, fundo claro #f2f5f9, papel #fdfdfb, linha #c7d0dc |
| Fontes | Roboto Condensed nos títulos e no wordmark, Source Sans 3 no texto, Courier Prime só em número de documento |
| Tom | Calmo, humano, sóbrio, regulado. Sem neon, sem gradiente, sem "o futuro do cérebro" |

Navegação principal: About · Science · Products · Pipeline · Clinical Trials · Investors · Newsroom · Careers. No topo, menor: Healthcare Professionals, Contact, busca e o seletor de região "Global (English)", já que o site é só em inglês.

| Aba | O que tem |
| --- | --- |
| Home | Foto grande, a frase de missão, as três áreas (Sleep & Circadian Health, Memory & Cognition, Neurodiagnostics), notícias recentes, resumo do pipeline, uma história sobre medicina em ambiente extremo e a cotação NEUS |
| About | Quem somos, história em linha do tempo de 2003 a 2028, liderança (comitê executivo, conselho e liderança ampliada com o Holt), empresas do grupo com a Aegis e o link morto, locais, responsabilidade, governança |
| Science | A abordagem ("começamos por perguntas que a neurociência ainda não respondeu"), áreas de pesquisa, publicações e pôsteres em PDF |
| Products | Uma página por produto com indicação, como funciona, informação de segurança e link pra bula em PDF. O detalhe clínico fica atrás do aviso "Are you a healthcare professional?" |
| Pipeline | Gráfico por fase (I, II, III, registro) e lista de descontinuados |
| Clinical Trials | BOREAS-2 recrutando, o estudo militar sem nome, o Fase III do NS-091 e a política de transparência de estudos |
| Investors | Cotação estática da NEUS em CHF terminando em 19/10/2028, com a queda de 2026 visível, relatórios anual e semestral em PDF, calendário (resultados do terceiro trimestre em novembro de 2028), assembleia, ações e governança |
| Newsroom | Comunicados por data, biblioteca de mídia e contato de imprensa. Nenhum comunicado sobre a Kelvara |
| Careers | Vida na NeuroStat, vagas em Zurique e a seção "Field positions with our partners", que leva às vagas de Ødemark A |

Detalhes que vendem realismo:

- Banner de cookies que funciona e deixa recusar.
- Política de privacidade pela lei suíça e pelo GDPR, termos de uso, Impressum com número de registro suíço no formato CHE-xxx.xxx.xxx (dígito verificador válido) e declaração de acessibilidade.
- Tela "You are now leaving the NeuroStat website" antes de qualquer link externo, Kelvara e Aegis incluídas.
- Busca que funciona no conteúdo público.
- Página 404 da marca.
- Link "Partner Access" discreto no rodapé, que leva ao portal.

A frase de missão o Claude Code oferece em cinco opções ao Max antes de escrever a home.

## Produtos, pipeline e a ciência

A ciência do site inteiro precisa ser inteligente e checável: alvos reais, mecanismos reais, sufixo de nome genérico seguindo a nomenclatura internacional (INN) da classe e informação de segurança coerente com a classe. Os jogadores estudam biologia e química e vão ler. Só dois pontos estão errados, de propósito e de um jeito consistente (os furos, mais abaixo).

### No mercado

| Marca (genérico) | Classe | Indicação | Aprovado | Situação em 2028 |
| --- | --- | --- | --- | --- |
| Vesperil (ormelteon) | Agonista dos receptores de melatonina MT1/MT2 | Distúrbio do sono do trabalho em turnos | 2006 | Primeiro produto. Já enfrenta genérico |
| Lunavel (corexant) | Antagonista duplo dos receptores de orexina | Insônia de início e de manutenção do sono | 2017 | Maior venda da empresa |
| Migrestil (tolugepant) | Antagonista oral do receptor de CGRP | Tratamento agudo da enxaqueca em adultos | 2020 | No mercado. A extensão pra prevenção de enxaqueca crônica falhou na Fase III em 2026, derrubou a ação e foi descontinuada |
| NeuroStat Halo | Faixa de EEG de eletrodo seco, dispositivo médico | Estadiamento do sono e monitoramento de fadiga em trabalho por turnos | 2019 | No mercado |
| NeuroStat Baseline | Plataforma digital de avaliação cognitiva | Triagem de aptidão pro trabalho em ambiente extremo: offshore, polar, defesa | 2015 | No mercado. É o que o Fossum usa nas avaliações |

Os anos são sugestão e o Claude Code confirma com o Max.

### Pipeline

| Código · genérico | O que promete | Fase |
| --- | --- | --- |
| NS-091 · retrevamide | Primeiro da classe: devolve o acesso a memórias episódicas que continuam guardadas mas ficaram inacessíveis, em amnésia retrógrada depois de trauma | III |
| NS-760 · adravacetam | Mantém o desempenho cognitivo sob isolamento, privação de sono e ritmo circadiano quebrado por muito tempo | II (BOREAS-2) |
| Itens de enchimento, só com código | Dão a diversidade de um pipeline real. Exemplos pra confirmar com o Max: inércia do sono, ressincronização circadiana, delírio pós-operatório, nova geração do Halo | I a registro |

Remédio em pipeline só tem código e nome genérico. Marca só depois de aprovado.

### Estudos clínicos

- **BOREAS-2**: Fase II randomizado, duplo-cego e controlado por placebo, com o NS-760 em adultos que trabalham em rotação longa de inverno em instalação offshore de alta latitude. Local recrutando: Ødemark A, operada pela Kelvara Petrochemicals AS, com link. A participação é voluntária e só acontece pedindo ao médico da instalação. Hoje só a Chloe Verve toma a medicação. O "-2" pede um BOREAS-1 anterior; sugestão a confirmar com o Max: um piloto em Ødemark A no inverno 2027/28.
- **Estudo militar**: sem nome. Aparece como parceria com forças armadas europeias, "active, not recruiting", sem detalhe.
- **NS-091 Fase III**: em andamento em centros hospitalares, por convite.

### Os dois furos

**Biologia — retrevamide (NS-091).** O site diz que a molécula reativa "engramas silenciosos", memórias que continuam guardadas mas ficaram inacessíveis, e que faz isso só no conjunto de neurônios daquela memória, sem mexer nas outras. A pesquisa de base é real: em camundongo, uma memória perdida por amnésia retrógrada voltou quando os neurônios do engrama foram ativados por optogenética. Só que isso exigiu marcar geneticamente essas células no momento em que a memória foi formada. Uma pílula tomada pela boca não tem como saber quais neurônios guardam uma memória específica, ainda mais porque o mesmo neurônio participa de vários engramas. O site explica o mecanismo como "uma assinatura molecular persistente dos engramas silenciosos", coisa que a ciência real não conhece. Um biólogo pergunta como a molécula escolhe a memória.

Referências reais que o site cita como base. O Claude Code confere cada uma na internet antes de publicar:

- Liu X, Ramirez S, Pang PT, et al. Optogenetic stimulation of a hippocampal engram activates fear memory recall. Nature 484, 381–385 (2012).
- Ryan TJ, Roy DS, Pignatelli M, Arons A, Tonegawa S. Engram cells retain memory under retrograde amnesia. Science 348, 1007–1013 (2015).
- Roy DS, Arons A, Mitchell TI, et al. Memory retrieval by activating engram cells in mouse models of early Alzheimer's disease. Nature 531, 508–512 (2016).

**Química — adravacetam (NS-760).** O nome termina como os racetams (piracetam, levetiracetam), que são moléculas pequenas, entre 140 e 220 Da. A ficha físico-química num pôster em PDF, linkado pela página do BOREAS-2, mostra outra coisa:

| Propriedade | Valor no pôster |
| --- | --- |
| Fórmula | C51H80N10O17 |
| Massa molar | 1105,3 g/mol, batendo com a fórmula de propósito |
| Doadores de ligação de hidrogênio | 9 |
| Aceptores de ligação de hidrogênio | 23 |
| Área polar (TPSA) | 352 Å² |
| cLogP | −2,1 |
| Biodisponibilidade oral em rato | 74% |
| Razão cérebro/plasma (Kp) | 1,3 |
| Kp,uu | 0,92 |
| Efluxo por P-gp | razão 0,9, "sem transporte ativo identificado" |

Um químico vê na hora: a molécula quebra quase todas as regras de fármaco oral e de sistema nervoso central (massa acima de 500, muitos doadores, área polar muito acima dos ~90 Å² de costume), não tem transportador nenhum citado e mesmo assim entra no cérebro como se a barreira hematoencefálica não existisse. O Claude Code confere que a massa molar bate com a fórmula, pra o furo não parecer erro de digitação.

## Camadas escondidas

### Portal "NeuroStat Org. — Partner Access"

Fica em `/partner/` e o único link pra ele é o "Partner Access" do rodapé. Os jogadores entram com credenciais achadas nos props: um papel no escritório do Gunnar, o login próprio do Callum e o login do Fossum. Usuário e senha o Claude Code combina com o Max, porque precisam bater com os props.

Como funciona num site estático:

- No build, os documentos de cada conta viram um pacote criptografado com AES-256-GCM. A chave sai de usuário + senha por PBKDF2-SHA256, com sal e uns 600 mil ciclos.
- No navegador, a tela de login deriva a chave e tenta abrir o pacote. Senha errada mostra "The username or password is incorrect." depois de um segundo. Cinco erros seguidos mostram conta bloqueada por 15 minutos, com o contador guardado no navegador.
- "Forgot password?" leva a uma página dizendo que troca de senha é com o IT Service Desk.
- Os PDFs abrem dentro do portal com marca d'água "CONFIDENTIAL — <usuário>" e podem ser baixados.
- O texto aberto do portal nunca entra no site publicado. A checagem de vazamento procura frases-marcadoras de cada documento privado na pasta pronta e quebra o build se achar alguma.

| Conta | Quem é | Documentos |
| --- | --- | --- |
| Gunnar MacKenzie | Platform Supervisor de Ødemark A, conta de parceiro do grupo | Resumo de recuperações e alocações entre instalações do terceiro trimestre de 2028, o do Elias. Diretriz de operação de inverno 2028/29. Aviso de coordenação do BOREAS-2 na plataforma. Escala de contratados de prontidão no inverno, com Verdugo e Cardume como nomes de contrato |
| Callum Reid | Production Superintendent | Plano de integração depois da compra, com a Kelvara passando a responder a Clinical Field Operations. Revisão de quadro de pessoal do inverno. Metas de produção e corte de custo, com a ordem de manter a produção. Alocação de centro de custo do programa Legacy Sites, com Ødemark A listada, códigos NOETIC e uma linha de contrato Cinza |
| Dr. Nils Fossum | Médico da plataforma e investigador local do BOREAS-2 | Sinopse do protocolo, termo de consentimento da tripulação, registro de dispensação com uma única participante (iniciais C.V.), troca de mensagens com Dr. A. Fenn do Office of Clinical Affairs, relatório de adesão ao Baseline e a pasta das avaliações mensais, que o Max preenche depois com PDFs do gerador de props |

Tudo atrás do login é documento corporativo comum. Ninguém dessas contas sabe de anomalia, e os termos estranhos aparecem sem explicação nenhuma.

### Formulários automáticos

Nada sai do navegador. Cada envio mostra uma confirmação na tela com número de protocolo.

- Pré-triagem do BOREAS-2, com perguntas de elegibilidade de verdade. O resultado manda falar com o médico da instalação.
- Contato: "Your enquiry NS-CQ-xxxxx has been received."
- O aviso "Are you a healthcare professional?" na área de produtos.
- Newsletter e alerta de investidor.
- Vagas com candidatura encerrada ou feita por parceiro de recrutamento.

### Código-fonte e robots.txt

`robots.txt` e `sitemap.xml` comuns de empresa, que bloqueiam `/partner/` e a busca e mais nada.

Comentários esquecidos por um desenvolvedor da TI. Eles precisam sobreviver ao build, e o Claude Code confere na pasta pronta:

- No HTML de uma página da Newsroom, um TODO normal de trabalho com o nome de um sistema interno.
- Num arquivo JS pequeno escrito à mão (o do banner de cookies serve), a nota sobre o AnchorPoint. O dev esbarrou no AnchorPoint várias vezes, não sabe se avisa os superiores e deixou a nota no código pra lembrar quando abrir o VS Code de novo. O texto está na seção de textos de canon.

Canon pro Max: AnchorPoint é a fachada do site de autoajuda do Autor. No site da NeuroStat só o nome aparece, sem link.

## Site da Kelvara

Abre em norueguês (bokmål), com o seletor "NO | EN" no topo e tradução completa. O norueguês tem que soar como o site de uma operadora norueguesa de verdade, no registro corporativo de Equinor ou Aker BP. Norueguês fica na raiz e inglês em `/en/`.

O visual é industrial noturno e convidativo pra quem quer trabalhar lá e pra investidor: Ødemark A à noite na neblina, a luz laranja das gruas, gente de macacão laranja. As barras horizontais do logo de estratos viram motivo de interface, como divisória de seção, sublinhado do menu e a faixa laranja marcando a página atual.

| Elemento | Valor |
| --- | --- |
| Logo | Monograma de estratos com a barra laranja da zona produtora e o poço com a bolinha no fundo, mais KELVARA / PETROCHEMICALS AS. Existe como PNG; redesenhar em SVG fiel |
| Cores | Preto #161616, laranja #d9531e, laranja claro #f2a577, papel #fbfaf6 |
| Fontes | Michroma em título curto e espaçado, Arimo no texto, Courier Prime em número de documento |

| Aba (NO / EN) | O que tem |
| --- | --- |
| Forside / Home | Foto noturna, números principais, notícias, chamada pras vagas |
| Om oss / About | Quem somos, história desde 2011, liderança, propriedade (NeuroStat Holding AG desde 24/09/2028, Sundvor Partners AS de 2011 a 2028), conselho, valores |
| Virksomhet / Operations | Ødemark A com fatos e esquema, a base de Ågotnes e o Ågotnes Væskeanlegg, operação de inverno |
| HMS / HSE | Como a empresa trabalha segurança, números de segurança, cultura de reporte |
| Bærekraft / Sustainability | Emissões, comunidade e patrocínios, declaração da lei de transparência (Åpenhetsloven) em PDF |
| Karriere / Careers | Por que a Kelvara, como funciona a rotação, os depoimentos de Gunnar, Del e Sofie, vagas abertas e o aviso de que as vagas do inverno 2028/29 já estão preenchidas |
| Nyheter / News | Lista abaixo |
| Leverandører / Suppliers | Qualificação de fornecedor e fatura eletrônica (EHF) |
| Kontakt / Contact | Endereço postal de Stavanger e a base de Ågotnes |

Notícias, da mais nova pra mais antiga. Os textos principais estão na seção de canon:

- 24/09/2028: NeuroStat Holding AG compra a Kelvara.
- Operação de inverno 2028/29, com a rotação longa a partir de 1º de novembro e as rotinas de Mørketid.
- Patrocínio principal do barco de resgate voluntário RS «Sotrabuen», da Redningsselskapet.
- Feira de carreiras técnicas na Straume vidaregåande skule.
- O Havtil (Havindustritilsynet) aprova a extensão de vida útil de Ødemark A.
- Notícias antigas até 2011: fundação e compra da plataforma, retomada da produção, abertura da planta de Ågotnes.

O rodapé tem org.nr., endereço, os links legais (Personvern, Informasjonskapsler, Åpenhetsloven) e banner de cookies em norueguês.

## Textos de canon

Escritos em inglês. No site da Kelvara, o Claude Code traduz pro bokmål e deixa o inglês em `/en/`. O Max revisa todos antes de publicar.

### Anúncio da compra (Kelvara, 24 de setembro de 2028)

> **NeuroStat Holding AG acquires Kelvara Petrochemicals AS**
>
> Stavanger, 24 September 2028. NeuroStat Holding AG (SIX: NEUS) has acquired 100 percent of the shares in Kelvara Petrochemicals AS from Sundvor Partners AS. Kelvara becomes a wholly owned subsidiary of the NeuroStat group. The transaction was completed today. Financial terms are not disclosed.
>
> Kelvara will continue as an independent operator under its own name, with its head office in Stavanger and its supply base and fluids plant at Ågotnes. Management and the organisation offshore and onshore remain unchanged. Ødemark A continues normal operations, and the winter rotation from 1 November goes ahead as planned.
>
> "Sundvor Partners founded Kelvara in 2011 to give Ødemark A a second life. With NeuroStat as owner, we have a long-term partner with a strong interest in safe operations and in the people who work offshore," says Eirik Sandvold, CEO of Kelvara Petrochemicals.
>
> NeuroStat and Kelvara have worked together since 2027, when Ødemark A became a study site in NeuroStat's research on health and cognitive performance in high-latitude offshore work.
>
> "Ødemark A is a well-run installation with an experienced crew. We look forward to supporting Kelvara's operations and its people," says Marcus Holt, Head of Clinical Field Operations at NeuroStat.
>
> *About Kelvara.* Kelvara Petrochemicals AS is a Norwegian oil and gas company headquartered in Stavanger. It operates the Ødemark A installation in the northern North Sea and a drilling fluids plant at Ågotnes. Kelvara has been part of the NeuroStat group since September 2028.

A única voz da NeuroStat no anúncio é o chefe de operações de campo, quando o normal seria o CEO ou o diretor financeiro. É detalhe pra jogador atento estranhar.

### Depoimentos (Kelvara, Karriere)

> **Gunnar MacKenzie, Platform Supervisor, Ødemark A**
>
> I've spent most of my working life in the North Sea, and Ødemark A is the oldest installation I've run. You have to respect a platform like this. My job is easy to explain: everybody goes home at the end of the rotation the same way they came out. We're a small crew, and nobody takes shortcuts on my platform. Kelvara gave me the chance to run Ødemark A my way, and I don't take that for granted.

> **Del Carbone, Chief Cook, Ødemark A**
>
> I've cooked in my family's restaurant, on a cruise ship and in a hospital kitchen, and a platform is the hardest crowd I've had. People work twelve hours in the cold and the dark, and a hot meal is the part of the day they look forward to. Saturday is steak night and nobody misses it. Lunch is sometimes a few minutes late. I'm told that's part of the charm.

> **Sofie Aune, Radio Operator, Ødemark A**
>
> I'm the voice on the radio, so sooner or later everyone talks to me. The helicopters and the supply boats call in through me, and so does the crew when something comes up down on the cellar deck. I moved around a lot growing up, and I didn't expect a platform in the North Sea to feel like home. It does, mostly because people here look out for each other.

O depoimento do Gunnar tem dois sentidos pra quem souber do incêndio e da dívida: "nobody takes shortcuts" e "I don't take that for granted".

### Relatório com o Elias (portal, conta do Gunnar)

Cabeçalho: **NeuroStat Org. · Clinical Field Operations — Cross-Installation Recovery and Placement Summary, Q3 2028.** Doc. NS-CFO-RPS-2028-Q3 · Classification: Confidential, installation managers · Programme: Legacy Sites · Cost category: NOETIC-03.

Texto de abertura: *This summary lists recoveries, retentions and placements recorded across installations in the Legacy Sites programme for Q3 2028. Installation managers should confirm their entries, or report no change, by 15 October 2028.*

| Installation | Recoveries Q3 | Retained | Placements | Notes |
| --- | --- | --- | --- | --- |
| ØDM-A Ødemark A | 0 | 0 | 0 | No change. Winter standby confirmed (Cardume). |
| Outras instalações com código opaco, a combinar com o Max | — | — | — | — |

Seção **Retained subjects now under contract**:

| Ref. | Name | Origin | Recovered | Status | Current assignment |
| --- | --- | --- | --- | --- | --- |
| R-0117 | MEYER, Elias | perguntar ao Max | perguntar ao Max | Retained | Independent contractor (field), on call |

Rodapé da seção: *Subjects not under contract are listed by reference only and are not reproduced in this summary.*

Só o Elias aparece com nome porque é a única linha de sujeito retido que virou contratado. O Gunnar recebeu isso, não entendeu e não quis entender.

### Nota do dev sobre o AnchorPoint (código-fonte)

```js
// NOTE (dk, 30 Sep 2028): AnchorPoint again. Third time since August
// it shows up in the referrer logs. Looks like some self-help site?
// No idea why they'd link to us. Not sure if this is worth flagging
// to InfoSec or if I'm overthinking it. Decide Monday. Leaving this
// here so I see it when I open VS Code.
```

As iniciais "dk", a data e o log de referência como lugar onde ele esbarra no AnchorPoint são sugestão. O Claude Code pergunta ao Max o nome do dev e se algum endereço do AnchorPoint aparece.

### Operação de inverno (Kelvara, notícia)

> **Winter operations 2028/29 on Ødemark A**
>
> From 1 November, Ødemark A moves to its winter schedule. Crew sign on for the full season until spring, since weather in the northern North Sea makes regular crew changes and supply runs uncertain over the winter months. Supply runs continue from Ågotnes when the weather allows, and helicopter transfers are limited to medical and operational needs.
>
> Through the darkest weeks the installation follows Kelvara's Mørketid routines, with fixed daylight-lamp schedules, regular contact with families onshore and close follow-up from the installation medic. Families can reach Kelvara's onshore contact team at any hour during the season.

### Vaga de campo (NeuroStat, Careers)

> **Field positions with our partners**
>
> NeuroStat works with partner companies that offer field positions in demanding environments, including offshore work in the Norwegian North Sea.
>
> **Ødemark A, Norwegian North Sea — Kelvara Petrochemicals AS.** Positions for the 2028/29 winter rotation have been filled. Current openings are listed on Kelvara's careers page.

### BOREAS-2 (NeuroStat, Clinical Trials)

> **BOREAS-2: NS-760 (adravacetam) in extended high-latitude offshore rotations**
>
> A Phase II, randomised, double-blind, placebo-controlled study of the safety, tolerability and efficacy of NS-760 in maintaining cognitive performance in adults working extended winter rotations on offshore installations at high latitude.
>
> Status: Recruiting. Study site: Ødemark A, Norwegian North Sea, operated by Kelvara Petrochemicals AS.
>
> Participation is voluntary. Eligible crew at participating installations can ask the installation medic about the study. The questionnaire below gives a first indication of whether you may be eligible.

## Imagens

Foto genérica vem de banco com licença livre (Unsplash ou Pexels), nunca de busca no Google, porque o site fica público. O Claude Code registra a fonte e a licença de cada uma em `docs/IMAGENS.md`. Retrato de pessoa com nome no site nunca usa foto de banco: o rosto de uma pessoa real como executivo de empresa fictícia é problema.

O Max gera as imagens específicas. Pra cada uma, o Claude Code deixa um placeholder com o nome de arquivo final e escreve em `docs/IMAGENS.md` um briefing com proporção, tamanho, clima, o que mostrar e o que evitar.

| Imagem | Quem faz | Notas |
| --- | --- | --- |
| Ødemark A à noite, na neblina, com a luz das gruas (hero da Kelvara) | Max | Condeep de concreto, três níveis, três gruas |
| Base de Ågotnes e Ågotnes Væskeanlegg | Max | — |
| Retratos de Gunnar, Del e Sofie | Max | Gunnar: cabelo loiro comprido, rosto fino, sem barba. Del: baixo e pesado, bigode grosso, barba de três dias mal feita, cabelo cortado em casa. Sofie: 25 anos, alegre |
| Retratos da liderança das duas empresas | Max | Ferri-Lutz, Steinmetz, Haldane, Dumont, Okonkwo, Holt; Sandvold, Østrem, Kvamme, Fjeldstad |
| Embalagens de Vesperil, Lunavel e Migrestil, e a faixa Halo | Max | — |
| Barco de resgate RS «Sotrabuen» | Max | — |
| Gente em lugar extremo, escritório, laboratório, Zurique, Stavanger, mar à noite | Banco livre | Gente de costas ou de longe sempre que der |

## Regras pro Claude Code

Escrita:

- Inglês corporativo regulado na NeuroStat. Bokmål corporativo de verdade na Kelvara, com o inglês ao lado.
- Prosa simples e específica, com número, data e nome. Sem paralelismo, sem "não X, mas Y", sem frase de efeito no fim do parágrafo e sem lista de três só pelo ritmo.
- A verdade vaza só por termo de duplo sentido. Nada sobrenatural é dito em lugar nenhum.
- Texto original. Nada copiado de site real de farmacêutica ou petroleira, nem de bula real.

Nomes e escolhas:

- Nome novo, objeto novo ou escolha temática fora deste pitch: perguntar ao Max com pelo menos cinco opções diferentes.
- Nenhum nome de pessoa real, nenhuma empresa real retratada como parceira, nenhum telefone ou e-mail real. Telefone e e-mail só aparecem depois de combinar com o Max um jeito de mostrar que não caia no número ou no domínio de alguém.

Realismo:

- Datas até 19/10/2028, © 2028 e "last updated" coerente.
- Celular perfeito, acessível (contraste, teclado, texto alternativo) e rápido.
- Sem analytics, sem script de terceiros, fontes servidas pelo próprio site.

Segredo:

- Nada de `private/` ou `docs/` vai pros repositórios publicados, e nenhum source map.
- A checagem de vazamento roda em todo build.
- Só aparece no site o que este pitch marca como público.

### Perguntas que o Claude Code ainda faz ao Max, cada uma com cinco opções ou mais

- [ ] Frase de missão da NeuroStat
- [ ] Endereço em Zurique, endereço de visita em Stavanger e endereço da base de Ågotnes
- [ ] Ano do IPO na SIX
- [ ] Conselho de administração das duas empresas
- [ ] Outros escritórios da NeuroStat, se tiver
- [ ] Empresas do grupo além da Aegis, e o domínio morto da Aegis
- [ ] Origem e ano de recuperação do Elias, e os códigos das outras instalações do relatório
- [ ] Nome ou iniciais do dev, onde ele esbarra no AnchorPoint e se algum endereço aparece
- [ ] Coordenadas e licença de Ødemark A, que precisam bater com o puzzle do céu
- [ ] Ano final da extensão de vida útil
- [ ] Número do barco RS «Sotrabuen»
- [ ] Usuários e senhas das três contas do portal, que precisam bater com os props
- [ ] Anos de aprovação dos produtos e itens de enchimento do pipeline
- [ ] BOREAS-1 como piloto em Ødemark A no inverno 2027/28
- [ ] Distribuição de cargos das diretorias das duas empresas
- [ ] Jeito de mostrar telefone e e-mail
- [ ] Revisão dos três depoimentos e do anúncio

## Ordem de trabalho

1. Ler este pitch inteiro. Fazer as perguntas pendentes ao Max em blocos pequenos, cada uma com cinco opções ou mais.
2. Montar `mru-sites`: workspaces, os dois apps Astro, o pacote do portal, a checagem de vazamento e a Action de deploy, testada com os repositórios publicados ainda privados.
3. Criar o sistema visual de cada marca: cores, tipos, componentes e os logos redesenhados em SVG.
4. Construir o site da NeuroStat, aba por aba.
5. Construir o site da Kelvara em norueguês e inglês.
6. Portal, formulários e comentários no código.
7. Pages CMS e `docs/COMO-EDITAR.md`.
8. Placeholders das imagens e `docs/IMAGENS.md`.
9. Revisar links quebrados, celular, acessibilidade, o norueguês, as referências científicas conferidas, a consistência dos dois furos e a ausência de vazamento.
10. Mostrar tudo ao Max rodando local. Ele torna os repositórios públicos e liga as Pages no lançamento.

Checklist de entrega:

- [ ] Os dois sites rodando local e publicando cada um na sua organização
- [ ] Portal abre com as três contas e recusa senha errada do jeito descrito
- [ ] Nenhum texto privado na pasta pronta
- [ ] O Max posta uma notícia e sobe um PDF no portal pelo CMS sem ajuda
- [ ] `COMO-EDITAR.md`, `IMAGENS.md` e `NOTAS-DO-MESTRE.md` escritos
