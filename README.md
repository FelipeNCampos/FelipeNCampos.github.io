# Portfólio Felipe —  narrativo 

[Design editável no Figma](https://www.figma.com/design/keTvan2jU7ldvieoXY5xO2) · [Wireframe](../docs/05-wireframe-portfolio.md)

Execute `node prototype/server.mjs` na raiz e abra [o protótipo local](http://127.0.0.1:4173). Também é possível abrir `prototype/index.html` diretamente.

## Escopo

Quatro atos, com as frases do briefing preservadas. A versão atual tem fundo branco, texto verde-escuro e detalhes em verde. O antigo editor de código foi substituído por um balão de conversa em SVG com duas engrenagens girando em loop. Na cena seguinte, três camadas — estrutura, lógica e experiência — se aproximam e se encaixam conforme a rolagem. As ilustrações são conceituais, sem métricas ou projetos reais.

O Figma e o wireframe acima documentam a versão escura anterior. Esta revisão branca está no protótipo HTML/CSS/SVG.

Após os quatro atos há duas seções baseadas no currículo fornecido: projetos pessoais e competências. Os três projetos desenvolvidos solo são o SaaS para condomínios no Reino Unido, a plataforma de coleta de dados corporativos e o CRM. Os cards apresentam ilustrações conceituais, descrições, tecnologias ou recursos documentados e detalhes expansíveis nativos (`details`/`summary`), acessíveis por teclado e sem depender de JavaScript.

As competências estão organizadas em backend/APIs, frontend, automação/integrações, dados/dashboards, infraestrutura e arquitetura/método. A apresentação também inclui Engenharia de Software em andamento na UFG e os idiomas do currículo. Não foram atribuídos percentuais de domínio nem inventados URLs de repositórios: o link aponta para o perfil geral no GitHub. O PDF não é publicado pelo servidor.

A seção final de contato mantém espaço reservado para foto, ícones e links para GitHub (`FelipeNCampos`), e-mail e WhatsApp. Os dados de contato vêm do briefing e do perfil informado pelo usuário. A foto ainda pode ser substituída por um retrato real.

Os fundos variam entre verde-menta, azul acinzentado e bege claro. Na passagem de ideia a produto, duas camadas de gradiente se alternam com o progresso da rolagem. A seção de contato usa halos suaves de azul e verde e um card branco.

O protótipo está isolado nesta pasta. Os diretórios de aplicação e o planejamento anterior continuam disponíveis para a futura implementação.

## Motor de animação definido para este esboço

CSS para composição, `position: sticky` para fixação e JavaScript com `requestAnimationFrame` para mapear o scroll. Não há dependências npm. Um listener passivo agenda no máximo uma atualização por frame; não há um loop contínuo quando a rolagem está parada.

- A abertura desaparece e sobe.
- O ato 2 ocupa um grid de duas colunas e três linhas; a ilustração ocupa as duas linhas inferiores.
- O ato 3 usa dois recortes complementares (`clip-path`) para sobrescrever o texto. A nova ilustração entra pela direita numa camada absoluta, evitando a terceira coluna implícita de `grid-column: 2 / 4`.
- Após a entrada da ilustração, a rolagem reduz a distância entre as três camadas até formarem uma interface montada. Ao voltar, as camadas se separam novamente.
- As engrenagens giram continuamente em sentidos opostos com animação CSS; `prefers-reduced-motion` interrompe esse loop e mostra as camadas já montadas.
- O ato 4 escreve o comando, revela três checks e preenche a barra. Todas as etapas retrocedem ao rolar para cima.
- Com `prefers-reduced-motion`, sem JavaScript, ou em janelas com menos de 540px de altura, a narrativa aparece em fluxo estático. Há um link de salto acessível por teclado.
- Em telas estreitas, o último ato empilha texto e terminal para manter a leitura.

Inter e IBM Plex Mono são carregadas pelo Google Fonts. Sem rede, o navegador usa Arial e Consolas/monospace.

A decisão anterior de GSAP + ScrollTrigger continua adequada como opção de implementação futura do vídeo. Este esboço não contém vídeo nem instala bibliotecas; valida os quatro atos e a direção visual solicitada.

## Verificação realizada

- Navegador Chromium do app: desktop 1280 × 720 e mobile 390 × 844.
- Entrada no ato 2 pelo link de rolagem, recorte intermediário e estado final do ato 3.
- Terminal completo no fim da página e reversão dos checks ao voltar.
- Sem overflow horizontal nesses tamanhos e sem erros no console durante os testes.
- Fallback estático em 900 × 500. O caminho de movimento reduzido compartilha essa composição.
- Sintaxe dos dois arquivos JavaScript verificada com `node --check`.

As quatro telas no Figma foram conferidas visualmente; a tipografia foi verificada nos 42 textos da narrativa. O limite de chamadas do plano Starter foi alcançado após salvar a correção de altura das notas, impedindo apenas a captura final desse guia. Safari, Firefox e dispositivos físicos ainda não foram testados.
