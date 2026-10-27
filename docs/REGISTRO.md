# Painel do Mestre

Uma página só sua, separada dos sites, para ver o que os jogadores mandam e para mexer nos sites durante a campanha.

- **Endereço:** https://maxhalasz.github.io/mru-sites/
- **Como abrir:** a página é uma tela preta, sem nada escrito. Digite a palavra de desbloqueio (não aparece nada na tela; não precisa clicar antes). Aparece uma linha apagada no meio da tela: digite a senha e dê Enter. Leva alguns segundos para abrir, e um pontinho apagado pulsa no meio enquanto isso. O botão "Trancar" volta para a tela preta.
- **Onde estão a palavra e a senha:** em `private/credentials.panel` (primeira coluna é a palavra, segunda é a senha). Elas não aparecem em nenhum arquivo do repositório, que é público.
- **Nos aparelhos que você já usou:** o navegador lembra a senha. Aí basta digitar a palavra e o painel abre sozinho. Se a senha lembrada estiver errada, a linha de senha volta a aparecer.
- **Segurança:** a palavra e a senha são curtas de propósito, por pedido seu. O pacote com as chaves é público (está no GitHub, criptografado) e só se protege por essas duas palavras. Quem adivinhar as duas lê as mensagens dos jogadores, vê os logins e publica avisos. Testar palavras no navegador é lento, mas alguém que baixe o arquivo e teste milhares de combinações no próprio computador conseguiria. Uma senha maior resolve (veja "Quando refazer o pacote do painel").
- Os sites nunca citam esse endereço.

## Abas

- **Visão geral:** resumo de tudo (mensagens novas, logins, documentos, data do jogo, avisos no ar, vagas) e a atividade recente.
- **Mensagens:** candidaturas da Kelvara, contato, triagem do BOREAS-2, newsletter, alertas de investidores, entradas no portal e documentos abertos. Busca, CSV, e atualização sozinha a cada 8 segundos. O que chegou desde a sua última visita fica destacado.
- **Logins:** um cartão por pessoa, com usuário e senha (mostrar e copiar), quantos documentos ela tem e se está ativa. Dá para:
  - **Editar:** mudar usuário, senha (tem botão de gerar), nome, função, mensagem de boas-vindas, pastas do portal, o aviso mostrado quando ela entra e a mensagem de bloqueio. Salvar publica na hora, e quem estiver dentro do portal é atualizado em segundos.
  - **Novo login:** cria uma pessoa nova, que entra no portal assim que você salva.
  - **Excluir:** tira o login do ar. Quem estiver dentro cai com "This account is no longer available", e o login deixa de funcionar.
  - **Bloquear:** "vale no próximo login" (quem já está dentro continua), "agora" (derruba a sessão em até 5 segundos) ou "e recarregar a página dela". **Desbloquear** devolve o acesso.
- **Documentos:** uma grade com todos os documentos nas linhas e todos os logins nas colunas. Marque para dar o documento a alguém, desmarque para tirar. Dá para marcar a linha inteira ("todos") ou a coluna inteira, buscar e filtrar por pasta ou origem. As mudanças ficam destacadas e só valem depois de **Aplicar**. Quem estiver dentro do portal vê a lista mudar em segundos. Documentos com data depois da data compartilhada ficam escondidos sozinhos.
- **Avisos:** uma faixa no topo de todas as páginas de um site (informativa ou de alerta), ou uma mensagem que cobre a tela inteira. Um aviso por site.
- **Vagas:** marca uma vaga da Kelvara como preenchida. Ela some da lista, do formulário e do diagrama, e a contagem e os textos ("quatro vagas") se ajustam. O anúncio de roughneck tem duas posições: dá para preencher uma de cada vez ("Preencher uma") ou as duas de uma vez.
- **Data:** a data de hoje no jogo, compartilhada por todos os sites. Tem +1 dia, −1 dia, +1 semana e "voltar ao padrão" (19 de outubro de 2028).
- **Recarregar páginas abertas** (botão na lateral): faz todas as páginas abertas dos sites recarregarem agora.

## Como os logins e os documentos funcionam

- Cada documento do portal é um arquivo criptografado com uma chave própria, guardado no site (`/partner/lib/`). Quem não tem a chave não lê nem o título.
- Cada login recebe um **chaveiro**: um registro pequeno, criptografado com o usuário e a senha dele, que lista os documentos que ele pode abrir e a chave de cada um. Dar ou tirar um documento é reescrever o chaveiro. Mudar a senha também.
- A lista de logins (usuário, senha, nome, documentos) fica num registro criptografado que só o painel abre. Por isso a senha que você vê no painel é sempre a atual, e vale em qualquer aparelho.
- O arquivo `private/credentials` só serve de ponto de partida. Depois do primeiro uso do painel, quem manda é o painel: mudanças feitas lá não voltam para esse arquivo (e ele fica velho).
- Os documentos novos entram na biblioteca assim: ponha o `.md` e o arquivo em `private/portal/<pasta>/`, rode `npm run panel-bundle` e faça o commit de `apps/neurostat/public/partner/lib/` e do pacote do painel. Depois é só dar o documento a quem você quiser, na aba Documentos.
- Cada login pode ter até uns 25 documentos, e a lista toda comporta uns 25 logins. Passou disso, o painel avisa.

## Como funciona

- Cada mudança vira um aviso assinado com uma chave que só está no seu pacote. Os sites conferem a assinatura, então ninguém consegue publicar no seu lugar.
- Os sites consultam o banco a cada 5 segundos (a cada 60 se a aba estiver em segundo plano). Por isso as mudanças chegam em segundos.
- Cada aviso fica guardado e não dá para apagar pelos sites. Os mais recentes valem, então desfazer é só publicar de novo (por exemplo, "Desbloquear").
- Cada mensagem dos jogadores é embaralhada no navegador deles antes de sair. O banco guarda texto ilegível, e a chave que desfaz isso fica no seu pacote.

## O que isso não faz

- Bloquear e esconder valem no navegador do jogador. Quem entende de código consegue contornar. Para a mesa, funciona como um interruptor.
- Qualquer pessoa pode criar entradas no banco (é assim que os formulários funcionam). Alguém que soubesse como poderia entupir a lista, mas não consegue publicar um aviso válido.

## O que acompanha a data compartilhada

Tudo que tem data nos sites aparece ou some conforme a data definida na aba Data, nos dois sites, em segundos:

- **NeuroStat:** notícias (home e Newsroom), relatórios e apresentações (Investors e Governança), vagas em Zürich, a história da empresa, os produtos (aparecem no ano da aprovação), os estudos clínicos (aparecem quando começam), as colunas de resultados da tabela de Investors (cada uma aparece no dia do relatório) e o calendário financeiro (mostra só o que ainda está por vir, os próximos 4).
- **Preço da ação:** a cotação, a variação, a data do fechamento e os gráficos são refeitos para a data escolhida, a partir do histórico de preços. Para datas depois de 19 de outubro de 2028 o preço fica no último fechamento que existe.
- **Frases que mudam de tempo:** por exemplo, "A Assembleia Geral de 2028 foi realizada em 20 de abril de 2028" vira "será realizada" antes dessa data. Na Kelvara, o texto sobre quem é dona da empresa muda no dia da compra (24 de setembro de 2028): antes, Sundvor Partners AS; depois, NeuroStat.
- **Kelvara:** notícias, vagas, documentos de sustentabilidade, a história da empresa e os links para notícias.
- **Páginas de detalhe:** abrir diretamente o endereço de uma notícia, produto ou estudo que ainda não existe na data mostra "Esta página não está disponível".
- **Documentos do portal:** os que têm data depois da data compartilhada ficam escondidos.

Para novas coisas com data, use os atributos `data-date="AAAA-MM-DD"` (aparece a partir desse dia) e `data-until="AAAA-MM-DD"` (aparece até esse dia). Quem abre a página vê as duas formas de uma frase no código-fonte, mas só uma aparece.

Para testar uma data sem mexer no painel, abra o site no seu computador (`npm run dev:neurostat`) e acrescente `?today=2027-03-01` ao endereço. Isso só funciona no computador local.

## Data e conteúdo para o futuro

- A data compartilhada decide o que aparece: notícias, vagas e documentos do portal com data posterior ficam escondidos, e o ano do rodapé acompanha.
- Para deixar uma notícia pronta para uma data futura, escreva-a com a data e coloque `scheduled: true` no arquivo (NeuroStat: `src/content/news/*.md`; Kelvara: `src/content/news/*.yml`, `jobs/*.yml` e `documents/*.yml`). Ela aparece quando a data compartilhada chega nela. Atenção: o texto vai no código da página, escondido. Quem abrir o código-fonte consegue ler. Para segredos, não use `scheduled`.
- Documentos do portal não têm esse problema: ficam dentro do pacote criptografado. É só dar a data do documento e ele aparece quando a data chega.

## Site novo no futuro

1. Dentro do novo app, copie `public/js/log-config.js` e `public/js/control.js` de um dos sites e mude o nome em `site:`.
2. Carregue `/js/log-config.js` e `/js/control.js` no layout, como os outros sites fazem.
3. Rode `npm run gm-bundle` e faça o commit do arquivo `.bin`. O painel passa a listar o site em "Avisos", e a data compartilhada já vale para ele.

## Apagar as entradas de teste

Existem entradas de teste: uma mensagem ("TEST - ignore (setup check)") e os avisos numerados do painel feitos durante os testes (todos neutros). Para apagar:

1. Abra o console do Firebase, projeto `sitesmru`, **Firestore Database**.
2. Clique na coleção `submissions`.
3. Clique nos três pontinhos ao lado do documento e em **Delete document**.

Os sites não conseguem apagar nem alterar entradas, só criar. Por isso apagar é sempre por aí. Se apagar os avisos, apague todos (os nomes começam com `ctl-`), ou deixe como estão: o mais novo é o que vale.

## Guarde estes arquivos

A pasta `private/` existe só neste computador e não vai para o GitHub:

- `doc-keys.json`: as chaves de cada documento da biblioteca e a chave da lista de logins. **Se perder, os documentos já publicados deixam de abrir para todos os logins, e a lista de logins fica ilegível.**
- `log-keys.json`: a chave que lê as mensagens e a chave que assina os avisos. **Se perder, as mensagens ficam ilegíveis para sempre e o painel não consegue mais publicar.**
- `credentials.gm`: usuário e senha do mestre.
- `firebase.json`: projeto e chave pública do Firebase.

Faça uma cópia da pasta inteira num pen drive ou na nuvem.

## Quando refazer o pacote do painel

O painel guarda dentro do pacote criptografado a lista de logins de portal, os documentos de cada um, as vagas e os sites. Sempre que mudar algum desses, rode `npm run panel-bundle` e faça o commit do arquivo `.bin` em `apps/painel/p/`.

Para trocar a palavra ou a senha, edite `private/credentials.panel` (palavra, senha e `gm`, separados por tab) e rode `npm run panel-bundle`. Se trocar a palavra, avise para eu atualizar a conferência dela na página (`PHRASE_HASH` em `apps/painel/painel.js`).

## Mudar a senha do mestre (tela de leitura do portal)

O login do mestre em `https://neurostat-group.github.io/partner/` continua existindo, só para ler as mensagens.

1. Edite a senha em `private/credentials.gm`.
2. Rode `npm run gm-bundle` na pasta do projeto.
3. Faça o commit do arquivo `.bin` que mudou em `apps/neurostat/public/partner/d/` e dê push.

## Se alguma coisa parar de funcionar

- O jogador nunca vê erro de registro. Se o envio falhar (sem internet, por exemplo), o navegador dele guarda a entrada e tenta de novo na próxima visita.
- Se um site não obedece ao painel, abra o painel e confira a linha no topo ("Último aviso publicado"). Se ela mostra um número recente, o aviso saiu e o site é que não leu: peça para recarregar a página.
- As regras do banco estão em `firebase/firestore.rules` (só criar, nunca apagar). Se alguém mexer nelas no console, os envios passam a falhar com erro 403.
- Outro caminho para as mensagens: o login do mestre em `https://neurostat-group.github.io/partner/` abre uma tela só de leitura do registro.
