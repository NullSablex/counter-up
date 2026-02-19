# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.

Este projeto segue o Versionamento Semântico.

## [0.2.0] - 2026-02-19

### Adicionado

- Modo headless: passar `null` (ou `undefined`) como `target` executa a animação sem nenhum elemento DOM. Os valores são entregues exclusivamente pelo callback `onUpdate`. Permite uso em Node.js, frameworks SSR (Next.js, Nuxt, Remix) e ambientes de teste sem jsdom.
- Adicionada opção `sleep` (número em ms): tempo de espera antes de a animação iniciar. `0` (padrão) mantém o comportamento atual. O timer é cancelado automaticamente por `stop()`, `pause()` e `destroy()`. Útil para escalonar múltiplos contadores sem `setTimeout` manual.
- Adicionado getter `waiting` nas instâncias: retorna `true` enquanto o `sleep` estiver pendente.
- `end` agora é opcional quando um elemento DOM é fornecido. A biblioteca lê o `element.textContent`, remove caracteres não numéricos e usa o valor parseado como destino da animação — um valor renderizado pelo servidor (ex.: PHP) já é suficiente, sem configuração extra.
- `decimals` agora é inferido automaticamente do texto do elemento quando ambos `end` e `decimals` são omitidos (ex.: elemento com `"15.50"` define `decimals: 2` automaticamente).
- Adicionadas declarações TypeScript nativas (`src/counterup.d.ts`): tipos completos para `CounterUpOptions`, `CounterUpInstance`, `CounterUpGroupInstance`, `CounterUpTarget`, `EasingFunction`, `FormatterFunction` e `CounterUpCallback`, com overloads precisos que diferenciam instância única (target `null` ou `Element`) de instância de grupo (seletor, `NodeList`, array). Sem dependência de `@types/*`.

### Corrigido

- Corrigido `ReferenceError: requestAnimationFrame is not defined` em ambientes sem browser, introduzindo polyfills internos `raf`/`caf` que usam `setTimeout`/`clearTimeout` com `Date.now()` como timestamp.
- Corrigido `ReferenceError: document is not defined` ao passar um seletor CSS string em ambientes sem DOM. Agora é lançado um erro claro e acionável.
- Corrigido `TypeError: Cannot set properties of undefined` no wrapper UMD quando carregado como ES module em Node.js (pacotes com `"type": "module"`). O contexto global agora usa `globalThis` como alvo primário, com `window` e `this` como fallback.
- Corrigido `TypeError: Cannot set property 'textContent' of null` quando `element` é `null` em modo headless. A função `render` agora protege a escrita no DOM.
- Corrigido `setupObserver` tentando chamar `IntersectionObserver.observe(null)` em modo headless. A configuração do observer agora é ignorada quando não há elemento.

### Alterado

- O global UMD agora é `counterUp` (a função diretamente) em vez de `CounterUp` (um objeto namespace). O uso via `<script>` tag agora é `counterUp(target, options)` em vez de `CounterUp.counterUp(target, options)`.
- `require()` CommonJS agora retorna a função `counterUp` diretamente, consistente com o export padrão ESM.
- README totalmente reescrito: cada opção documentada em detalhe com tipo, valor padrão e descrição. Adicionado exemplo de modo headless e tabelas de referência da API aprimoradas.
- CHANGELOG migrado do inglês para o português, incluindo todas as entradas anteriores.
- Keywords do `package.json` atualizadas: adicionados `typescript`, `ssr` e `headless` para melhorar a descoberta no npm.
- Demo (`demo/index.html`) completamente reescrita com 14 seções e 30+ exemplos ao vivo, cada um acompanhado do código exibido lado a lado. Cobre todas as opções e formatos de uso: básico, duração, formatação (moeda, porcentagem, temperatura), locale, easing embutido e custom, formatter personalizado (abreviação K/M/B, MM:SS, índice de grupo), sleep/stagger com getter `.waiting`, startOnView, múltiplos elementos, controles manuais (start/pause/resume/stop/reset/set), callbacks (onUpdate/onComplete), update dinâmico com troca de formatação, auto-detecção de `end` e `decimals` do HTML, contagem regressiva e modo headless com barras de progresso.

## [0.1.6] - 2026-02-16

### Adicionado

- Adicionado início por viewport com `startOnView` usando `IntersectionObserver`.
- Adicionadas opções do observer: `once`, `root`, `rootMargin` e `threshold`.

## [0.1.4] - 2026-02-16

### Corrigido

- Corrigido comportamento da animação pausada ao chamar `start()` novamente. Agora retoma do ponto pausado em vez de pular diretamente para o valor final.

## [0.1.2] - 2026-02-16

### Alterado

- Nome do pacote migrado para pacote npm com escopo: `@nullsablex/counter-up`.
- README atualizado para instalação/importação com escopo e badges do npm.
- Workflow de release atualizado com configuração de escopo npm para `@nullsablex`.

## [0.1.1] - 2026-02-16

### Adicionado

- Workflows do GitHub Actions para CI, release no npm, revisão de dependências, CodeQL e mensagens de boas-vindas para primeira interação.
- Arquivos de governança do projeto: `LICENSE`, `CONTRIBUTING.md` e `CODE_OF_CONDUCT.md`.
- Badges no README e link para demo no GitHub Pages.

### Alterado

- Estrutura e redação do README para uma apresentação mais limpa e profissional.
- Geração do banner de build agora lê metadados (incluindo versão) do `package.json`.

## [0.1.0] - 2026-02-16

### Adicionado

- Versão pública inicial da biblioteca de animação de contadores.
- Saídas ESM e UMD, incluindo bundles minificados.
- Seleção de elemento único e múltiplo (`id`, `class`, `NodeList`, array de elementos).
- Controles de instância: `start`, `pause`, `resume`, `stop`, `reset`, `set`, `update`, `destroy`.
