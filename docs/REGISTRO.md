# Painel do Mestre

Uma página só sua, separada dos sites, para ver o que os jogadores mandam e para mexer nos sites durante a campanha.

- **Endereço:** https://maxhalasz.github.io/mru-sites/
- **Como abrir:** a página é uma tela preta, sem nada escrito. É só digitar `halasz` (não aparece nada na tela) e o painel abre. O botão "Trancar" volta para a tela preta.
- **Primeira vez em cada aparelho:** abra o endereço com o segredo no fim: `https://maxhalasz.github.io/mru-sites/#SEGREDO`. O segredo é a segunda coluna de `private/credentials.panel`. O navegador lembra dele, tira da barra de endereço, e nas próximas vezes basta o endereço simples e digitar `halasz`.
- **Por que existe o segredo:** "halasz" sozinho seria fácil de adivinhar (está até no endereço). Quem acertasse leria as mensagens dos jogadores e poderia publicar avisos. O segredo longo é o que de fato protege o pacote com as chaves.
- A página é pública, mas sem o segredo ela fica preta para sempre. Os sites nunca citam esse endereço.

## Abas

- **Mensagens:** candidaturas da Kelvara, contato, triagem do BOREAS-2, newsletter, alertas de investidores, entradas no portal e documentos abertos. Busca, CSV, e atualização sozinha a cada 8 segundos. O que chegou desde a sua última visita fica destacado.
- **Logins:** todos os logins de portal com a senha (mostrar e copiar). Para cada um:
  - **Bloquear (vale no próximo login):** ele continua dentro se já estiver logado, mas não consegue entrar de novo.
  - **Bloquear agora (derruba a sessão):** a sessão dele cai em até 5 segundos, com a mensagem de bloqueio.
  - **Bloquear e recarregar a página dele:** a página dele recarrega em até 5 segundos e volta à tela de login.
  - **Desbloquear.**
  - **Aviso:** um texto que aparece no portal quando ele entra.
  - A mensagem de bloqueio é editável.
- **Documentos:** esconde ou libera cada documento de cada login, ao vivo, mesmo com o jogador dentro do portal. Documentos com data depois da data compartilhada ficam escondidos sozinhos.
- **Avisos:** uma faixa no topo de todas as páginas de um site (informativa ou de alerta), ou uma mensagem que cobre a tela inteira. Um aviso por site.
- **Vagas:** marca uma vaga da Kelvara como preenchida. Ela some da lista, do formulário e do diagrama, e a contagem e os textos ("três vagas") se ajustam.
- **Data:** a data de hoje no jogo, compartilhada por todos os sites. Tem +1 dia, −1 dia, +1 semana e "voltar ao padrão" (19 de outubro de 2028).
- **Recarregar todas as páginas** (botão no topo): faz todas as páginas abertas dos sites recarregarem agora.

## Como funciona

- Cada mudança vira um aviso assinado com uma chave que só está no seu pacote. Os sites conferem a assinatura, então ninguém consegue publicar no seu lugar.
- Os sites consultam o banco a cada 5 segundos (a cada 60 se a aba estiver em segundo plano). Por isso as mudanças chegam em segundos.
- Cada aviso fica guardado e não dá para apagar pelos sites. Os mais recentes valem, então desfazer é só publicar de novo (por exemplo, "Desbloquear").
- Cada mensagem dos jogadores é embaralhada no navegador deles antes de sair. O banco guarda texto ilegível, e a chave que desfaz isso fica no seu pacote.

## O que isso não faz

- Bloquear e esconder valem no navegador do jogador. Quem entende de código consegue contornar. Para a mesa, funciona como um interruptor.
- Qualquer pessoa pode criar entradas no banco (é assim que os formulários funcionam). Alguém que soubesse como poderia entupir a lista, mas não consegue publicar um aviso válido.

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

- `log-keys.json`: a chave que lê as mensagens e a chave que assina os avisos. **Se perder, as mensagens ficam ilegíveis para sempre e o painel não consegue mais publicar.**
- `credentials.gm`: usuário e senha do mestre.
- `firebase.json`: projeto e chave pública do Firebase.

Faça uma cópia da pasta inteira num pen drive ou na nuvem.

## Quando refazer o pacote do painel

O painel guarda dentro do pacote criptografado a lista de logins de portal, os documentos de cada um, as vagas e os sites. Sempre que mudar algum desses, rode `npm run panel-bundle` e faça o commit do arquivo `.bin` em `apps/painel/p/`.

Para trocar o segredo ou a palavra, edite `private/credentials.panel` (palavra, segredo e `gm`, separados por tab). Se trocar a palavra, avise para eu atualizar a conferência dela na página.

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
