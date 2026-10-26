# Ver o que os jogadores enviam

Tudo que os jogadores mandam pelos sites é guardado e aparece numa tela só sua, dentro do login de parceiros da NeuroStat.

## Como abrir

1. Entre em https://neurostat-group.github.io/partner/
2. Use o usuário e a senha do mestre. Eles estão no arquivo `private/credentials.gm` deste computador (a primeira coluna é o usuário, a segunda é a senha).
3. A tela "Game master console" abre sozinha. Ninguém mais vê essa tela: para qualquer outro login o portal mostra só os documentos da conta.

Seu próprio login não aparece no registro.

## O que aparece

- Abas por tipo: candidaturas da Kelvara, contato (os dois sites), triagem do BOREAS-2, newsletter, alertas para investidores, entradas no portal e documentos abertos.
- Busca, botão **Download CSV** (abre no Excel) e atualização automática a cada 30 segundos.
- O que chegou desde sua última visita fica destacado.
- Senhas digitadas no portal nunca são guardadas. Só o usuário, a data e se deu certo.

## Como funciona

Cada envio é embaralhado no navegador do jogador antes de sair. O que fica no banco do Firebase (projeto `sitesmru`) é texto ilegível. A chave que desfaz isso está dentro do pacote criptografado da sua conta, e só abre com seu login. Quem olhar o código dos sites ou o banco não consegue ler nada.

## Apagar as entradas de teste

Existe uma entrada de teste ("TEST - ignore (setup check)", tipo Contact). Para apagar:

1. Abra o console do Firebase, projeto `sitesmru`, **Firestore Database**.
2. Clique na coleção `submissions`.
3. Clique nos três pontinhos ao lado do documento e em **Delete document**.

Os sites não conseguem apagar nem alterar entradas, só criar. Por isso apagar é sempre por aí.

## Guarde estes arquivos

A pasta `private/` existe só neste computador e não vai para o GitHub:

- `log-keys.json`: a chave que lê o registro. **Se perder, as entradas ficam ilegíveis para sempre.**
- `credentials.gm`: usuário e senha do mestre.
- `firebase.json`: projeto e chave pública do Firebase.

Faça uma cópia da pasta inteira num pen drive ou na nuvem.

## Mudar a senha do mestre

1. Edite a senha em `private/credentials.gm`.
2. Rode `npm run gm-bundle` na pasta do projeto.
3. Faça o commit do arquivo `.bin` que mudou em `apps/neurostat/public/partner/d/` e dê push.

## Se alguma coisa parar de funcionar

- O jogador nunca vê erro de registro. Se o envio falhar (sem internet, por exemplo), o navegador dele guarda a entrada e tenta de novo na próxima visita ao site.
- As regras do banco estão em `firebase/firestore.rules` (só criar, nunca apagar). Se alguém mexer nelas no console, os envios passam a falhar com erro 403.
