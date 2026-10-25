# Ver o que os jogadores enviam (registro em planilha)

Os sites guardam tudo o que os jogadores mandam numa **planilha do Google que só você vê**. Cada tipo de formulário vira uma aba, com uma linha por envio:

| Aba | O que entra |
| --- | --- |
| Candidaturas | Vaga escolhida, nome, e-mail, anos offshore, confirmação de certificados, mensagem (site da Kelvara) |
| Contato | Formulários de contato dos dois sites |
| BOREAS-2 triagem | Todas as respostas do questionário e o resultado ("May be eligible" ou "May not be") |
| Newsletter e Alertas investidor | E-mails inscritos |
| Portal logins | Cada tentativa de entrar no portal: usuário, deu certo ou não, quantas falhas seguidas. **A senha digitada nunca é enviada** |
| Portal documentos | Qual usuário abriu qual documento |

Toda linha traz data e hora, site, protocolo (o número que o jogador viu), página, idioma e navegador. Se o site ganhar um campo novo, a coluna aparece sozinha.

**Enquanto você não fizer a configuração abaixo, nada é salvo.** Os sites mostram o protocolo normalmente, mas os envios se perdem. Faça isso antes de mandar o link para os jogadores.

## Configurar (uns 5 minutos, uma vez só)

1. Abra https://sheets.google.com e crie uma planilha em branco. Dê o nome "Sites: registro".
2. No menu da planilha: **Extensões → Apps Script**.
3. Apague o código que estiver lá e cole o conteúdo inteiro de [`docs/apps-script-registro.gs`](apps-script-registro.gs) (abra o arquivo no GitHub e use "Copy raw file"). Clique em **Salvar**.
4. Clique em **Implantar → Nova implantação**. Na engrenagem escolha **App da Web** e preencha:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Clique em **Implantar**. O Google pede autorização: **Autorizar acesso → escolha sua conta → Avançado → Acessar (não seguro) → Permitir**. O aviso aparece porque o script é seu e não foi revisado pelo Google, é normal.
6. Copie o **URL do app da Web** (termina em `/exec`).
7. **Me mande esse URL.** Eu coloco nos dois sites e publico. (Se preferir, cole o endereço entre as aspas em `apps/kelvara/public/js/log-config.js` e em `apps/neurostat/public/js/log-config.js`.)
8. Teste: abra o site da Kelvara, mande uma candidatura de teste e confira se a linha apareceu na aba "Candidaturas".

## Receber aviso por e-mail

No começo do script há a linha `const NOTIFY_EMAIL = '';`. Coloque seu e-mail entre as aspas e você recebe um e-mail a cada nova candidatura. Depois de alterar o script, vá em **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**. O endereço continua o mesmo.

## Bom saber

- O endereço do app não é secreto: qualquer pessoa que o tenha consegue mandar linhas. O site tem um campo-armadilha que descarta robôs, e o script impede que um texto começando com `=` vire fórmula.
- Os jogadores podem digitar nome e e-mail reais. Use só para a campanha e apague a planilha quando acabar.
- Para parar de salvar, apague o endereço de `log-config.js` (nos dois sites) e publique.
