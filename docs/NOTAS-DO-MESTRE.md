# Notas do mestre

Este arquivo nunca vai para os sites publicados. Ele guarda o que os jogadores não podem ler.

## A verdade por trás dos sites

- **NeuroStat** localiza e reabre o legado operacional da DRE. Boa parte da ciência dela vem de pesquisa anômala, usada para resolver perguntas abertas de bioquímica e neurociência.
- **Fisher** é cofundador e é importante até hoje. No site só aparece o nome, sem foto e sem biografia.
- **Ferri-Lutz** (CEO) é figura decorativa. Quem manda é um membro da Diretoria sem rosto, amigo próximo dele. A Diretoria nunca aparece.
- **Marcus Holt** é chefe da Field Division e sabe o que aconteceu com o Elias Meyer.
- **Aegis Corporation** é o braço operacional mais externo. O link no site vai para `aegiscorp.net`, que não existe.
- **Kelvara** é da NeuroStat desde 2011 por meio dos investidores (a Sundvor Partners era ligada a ela). A compra de 24/09/2028 é a NeuroStat tirando a máscara. O org.nr. 921 447 306 tem dígito verificador inválido de propósito.
- O nome antigo de Ødemark A ainda não existe no canon. A história antes de 2011 nunca aparece.

## Termos sem explicação nos documentos do portal

| Termo | O que é |
| --- | --- |
| Verdugo | Extrai espécime vivo |
| Cinza | Limpa o local e neutraliza testemunha |
| Cardume | Escolta |
| NOETIC | Classe de anomalia de conhecimento da NeuroStat |
| Legacy Sites | Programa de reabrir instalações da DRE (Ødemark A está na lista) |

Nenhuma conta do portal sabe de anomalia. O Gunnar acha que são nomes de outros projetos.

## Elias Meyer

Irmão gêmeo do Erik, dado como morto desde a infância. Aparece só no relatório da conta do Gunnar (`NS-CFO-RPS-2028-Q3`): ref. R-0117, origem **BMH-01**, recuperado em **05/09/2023**, status "Retained", hoje "Independent contractor (field), on call". Outras linhas "Retained" aparecem só por referência (R-0098, R-0112, R-0121). Isso pode virar enredo da próxima campanha, então o documento não diz mais nada.

As outras instalações listadas no relatório usam códigos opacos: FAL-01, RMM-02 e WIE-03 (BMH-01 só aparece como origem).

## Os dois furos científicos

1. **Biologia, retrevamide (NS-091).** A página Science diz que a molécula reativa "engramas silenciosos" só no conjunto de neurônios daquela memória, por "uma assinatura molecular persistente". A pesquisa real exigiu marcação genética no momento da formação da memória e ativação por optogenética. Uma pílula não sabe quais neurônios guardam uma memória. As três referências citadas foram conferidas no Crossref (Nature 484, Science 348, Nature 531).
2. **Química, adravacetam (NS-760).** O sufixo "-racetam" sugere molécula pequena (140 a 220 Da), mas o pôster `ns-760-profile-poster.pdf` mostra C51H80N10O17, 1105,3 g/mol (confere com a fórmula), 9 doadores e 23 aceptores de H-ligação, TPSA 352 Å², cLogP −2,1, biodisponibilidade oral de 74% em rato e Kp,uu de 0,92, sem efluxo por P-gp. Nada disso é possível para uma molécula assim. O pôster é linkado pela página BOREAS-2.

## Cinco pistas da NeuroStat para a Kelvara

Todas no site público da NeuroStat, de fácil a difícil:

1. Clinical Trials, BOREAS-2: local do estudo "Ødemark A, operada pela Kelvara", com link.
2. Careers, "Field positions with our partners": a vaga e o link para a página da Kelvara.
3. Home, "Medicine at the edge": a tripulação da Ødemark A desde 2027, com link para a Kelvara.
4. Pôster do NS-760 (PDF): agradecimento "study site support from Kelvara Petrochemicals AS (Ødemark A)".
5. Investors: a Sundvor Partners AS aparece como maior acionista (9,8%), e o relatório anual 2027 (PDF) diz que a Sundvor também é dona da Kelvara. Esta é a que liga as duas empresas antes de 2028.

Bônus: a busca do site por "Kelvara" devolve essas páginas, e os documentos do portal citam a Ødemark A.

## Menções à Aegis Corporation

NeuroStat: lista de empresas do grupo (About), logística do estudo (página do BOREAS-2 e comunicado de 14/09), nota em Investors (relatório sob "Other"), Careers (vagas de segurança e logística) e pôster do NS-760. Kelvara: MS Nordvakt "operado pela Aegis Corporation" (Operations e Contact). Portal: escala de standby do Gunnar (contrato Cardume, operado pela Aegis). O link da NeuroStat vai para aegiscorp.net, que não existe.

## Empresas fora da marca (ainda sem site)

Duas empresas de fachada que a NeuroStat usa em lugares remotos, ao lado da Aegis. Nomes escolhidos pelo Max em 26/10/2026, todos internacionais (regra: nada da NeuroStat ou da DRE leva nome em língua local).

- **Hiemal**: opera estações polares (apoio, logística e manutenção). Do latim "invernal".
- **Eremos**: opera sítios no deserto (a ideia inicial era o Atacama). Do grego "deserto".

Nenhuma aparece nos sites hoje. Se aparecerem na lista de empresas do grupo (About) ou em documentos do portal, usar sempre esses nomes. A Aegis usa o logo que o Max mandou, em `packages/brand/logos/`.

## Vagas e registro

As três vagas da Kelvara (Roughneck, Driller, Subsea Operator) têm início em **28 de outubro de 2028**; a rotação de inverno da plataforma começa em 1º de novembro. As candidaturas e tudo o que os jogadores mandam (inclusive quem tenta entrar no portal e quais documentos abre) aparecem no Painel do Mestre (veja `REGISTRO.md`).

## Pistas no código-fonte

- `js/cookie-banner.js` (NeuroStat): nota do dev "jb" sobre o AnchorPoint, 30/09/2028. A Action confere que ela sobrevive ao build. O site só cita o nome, sem link nem domínio.
- `/newsroom/` (HTML): TODO do mesmo dev "jb" citando o sistema interno **Meridian** (arquivo de imprensa antigo) e o ticket NS-WEB-1184. A Action confere que o comentário sobrevive ao build.

## Portal "Partner Access"

Entrada pelo link "Partner Access" no rodapé. Logins (também em `private/credentials`):

| Conta | Usuário | Senha |
| --- | --- | --- |
| Gunnar MacKenzie | `gmackenzie` | `Trollsjo_1987` |
| Callum Reid | `c.reid` | `Fl4reStack!27` |
| Dr. Nils Fossum | `nfossum` | `Hjertevik.Poli9` |

Senha errada mostra "The username or password is incorrect." depois de 1 segundo. Cinco erros seguidos bloqueiam por 15 minutos (contador no navegador do jogador; apagar os dados do site zera). "Forgot password?" manda para o IT Service Desk.

Documentos que já estão lá (dê uma olhada, são todos corporativos e secos):

- Gunnar: resumo de recuperações do Q3 (com o Elias), diretriz de inverno, aviso do BOREAS-2, escala de standby (Verdugo e Cardume).
- Callum: plano de integração pós-compra, revisão de pessoal do inverno, metas e corte de custo (com a ordem de manter a produção), alocação do programa Legacy Sites (NOETIC e Cinza).
- Fossum: sinopse do protocolo, termo de consentimento, registro de dispensação (só C.V.), troca de mensagens com o Dr. A. Fenn, relatório de adesão ao Baseline, e a pasta "Monthly assessments" vazia para você preencher.

## O que eu inventei (pode trocar)

Tudo isto está fora do pitch e é substituível:

- Vagas da Kelvara: Roughneck, Driller e Subsea Operator (KV-2841 a KV-2843, início 28/10/2028, temporada inteira). Os requisitos (BOSIET, IWCF/IADC WellSharp etc.) são genéricos do setor.
- Maiores acionistas da NeuroStat: Sundvor Partners AS 9,8% e Rotbuche Capital AG 5,2% (inventado).
- Anos de abertura dos escritórios: Basel 2008, Boston 2014, Londres 2018. Funcionários: cerca de 1.100 (NeuroStat) e cerca de 190 (Kelvara).
- Números financeiros da NeuroStat (receita, lucro, dividendo, ações) e a série de cotação, que cai de CHF 116 para 74 em 12/03/2026 e fecha em CHF 84,35 em 19/10/2028. ISIN `CH0471833928` (dígito verificador válido) e UID `CHE-115.372.646` (idem). Podem coincidir com uma empresa real que eu não consigo verificar.
- Itens de enchimento do pipeline: NS-455 (ressincronização circadiana), NS-318 (inércia do sono), NS-529 (delirium pós-operatório), NS-D2 (Halo de nova geração) e os descontinuados NS-204 e NS-266.
- Estudo `NS091-301` (Fase III do NS-091), estudo militar `NS-AFC-01`.
- Notícias da NeuroStat e da Kelvara (temas, datas e citações), vagas, depoimentos traduzidos para o norueguês, números de segurança (TRIF 3,1) e emissões da Kelvara.
- Documentos do portal e quem assina o quê. O Dr. A. Fenn (Office of Clinical Affairs) vem do pitch; o texto não dá primeiro nome nem gênero.
- E-mails em `@neurostat.ch` e `@kelvara.no` (domínios que não estão registrados, conferi nos registros suíço e norueguês, então as mensagens não chegam a ninguém). Telefones: NeuroStat `+41 44 538 17 00` (sede e informações legais) e `+41 44 538 17 20` (imprensa); Kelvara `+47 51 94 30 00`. Os números são inventados e podem coincidir com números reais que eu não consigo verificar.
- Passos do estudo BOREAS-2 (20 semanas, desfecho primário na semana 12).

## Decisões ainda abertas

- Coordenadas e licença de produção de Ødemark A (têm de bater com o puzzle do céu). Não aparecem no site enquanto você não mandar.
- Revisão dos três depoimentos e do anúncio da compra, em inglês e em norueguês.

## Lembretes de segurança

- Nada de `private/` nem `docs/` vai para os repositórios publicados, e nenhum source map.
- A checagem de vazamento roda em todo build e quebra a publicação se achar senha, número ou título de documento privado, source map, caminho de pasta pessoal ou o nome `mru-sites`.
- O histórico publicado tem uma mensagem só ("Site update"), com autor "NeuroStat Web Team" ou "Kelvara Web Team". Nunca faça push direto nos repositórios publicados.
