# Counter Up

<p align="left">
  <a href="https://www.npmjs.com/package/@nullsablex/counter-up"><img alt="npm version" src="https://img.shields.io/npm/v/%40nullsablex%2Fcounter-up?color=blue"></a>
  <a href="https://www.npmjs.com/package/@nullsablex/counter-up"><img alt="npm downloads" src="https://img.shields.io/npm/dm/%40nullsablex%2Fcounter-up?color=blue"></a>
  <a href="https://github.com/NullSablex/counter-up/releases"><img alt="release" src="https://img.shields.io/github/v/release/NullSablex/counter-up?color=blue"></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/github/license/NullSablex/counter-up?color=brightgreen"></a>
  <a href="https://github.com/NullSablex/counter-up/graphs/contributors"><img alt="contributors" src="https://img.shields.io/github/contributors/NullSablex/counter-up?color=brightgreen"></a>
  <a href="./CONTRIBUTING.md"><img alt="contributions welcome" src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg"></a>
  <a href="https://github.com/NullSablex/counter-up/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/NullSablex/counter-up/ci.yml?branch=main&label=CI"></a>
  <a href="https://github.com/NullSablex/counter-up/actions/workflows/codeql.yml"><img alt="CodeQL" src="https://img.shields.io/github/actions/workflow/status/NullSablex/counter-up/codeql.yml?branch=main&label=CodeQL"></a>
  <a href="https://nullsablex.github.io/counter-up/demo/"><img alt="demo" src="https://img.shields.io/badge/demo-live-orange"></a>
  <a href="https://github.com/NullSablex/counter-up/stargazers"><img alt="stars" src="https://img.shields.io/github/stars/NullSablex/counter-up?style=social"></a>
</p>

Biblioteca JavaScript para animação de números no DOM, sem dependências externas.

## Recursos

- JavaScript puro (sem jQuery)
- Suporte a `id`, `class`, elemento DOM, `NodeList` e array de elementos
- Formatação com `Intl.NumberFormat`
- Saída ESM e UMD (normal e minificada)

## Instalação

```bash
npm install @nullsablex/counter-up
```

O pacote já inclui os arquivos prontos de `dist/` (ESM, UMD e minificados).  
Para usar a biblioteca, não é necessário rodar build.

## Demo

Acesse a demonstração online no GitHub Pages:  
`https://nullsablex.github.io/counter-up/demo/`

## Uso

### ESM (elemento único)

```js
import { counterUp } from "@nullsablex/counter-up";

counterUp("#total", {
  start: 0,
  end: 12500.5,
  duration: 1800,
  decimals: 2,
  prefix: "R$ ",
});
```

### ESM (múltiplos elementos por classe)

```js
import { counterUp } from "@nullsablex/counter-up";

const counters = counterUp(".metric", {
  start: 0,
  end: 1200,
  duration: 1400,
});

counters.update([100, 250, 999]);
```

### ESM (iniciar ao entrar na tela)

```js
import { counterUp } from "@nullsablex/counter-up";

counterUp(".metric", {
  end: 1500,
  startOnView: true,
  once: true,
  threshold: 0.2,
});
```

### Navegador (UMD)

```html
<script src="./dist/counterup.umd.min.js"></script>
<script>
  CounterUp.counterUp(".metric", { end: 5000, duration: 1500 });
</script>
```

## API

### `counterUp(target, options)`

`target`: seletor CSS, elemento DOM, `NodeList` ou array de elementos.

`options`:

- `start` (number, padrão `0`)
- `end` (number, padrão `100`)
- `duration` (number em ms, padrão `2000`)
- `decimals` (number, padrão `0`)
- `prefix` (string)
- `suffix` (string)
- `locale` (string, padrão `pt-BR`)
- `useGrouping` (boolean, padrão `true`)
- `easing` (`"linear"` | `"easeInOutQuad"` | `"easeOutCubic"` | function)
- `formatter` (function)
- `autostart` (boolean, padrão `true`)
- `startOnView` (boolean, padrão `false`): inicia quando o elemento entra na viewport
- `once` (boolean, padrão `true`): com `startOnView`, anima apenas uma vez
- `root` (Element|null, padrão `null`): root do `IntersectionObserver`
- `rootMargin` (string, padrão `"0px"`): margem do `IntersectionObserver`
- `threshold` (number|number[], padrão `0.1`): threshold do `IntersectionObserver`
- `onUpdate` (function)
- `onComplete` (function)

`formatter`, `onUpdate` e `onComplete` recebem: `(value, element, index)`.

### Instância (1 elemento)

Métodos: `start()` (inicia ou retoma se pausado), `pause()`, `resume()`, `stop()`, `reset()`, `set(value)`, `update(nextEnd, nextOptions?)`, `destroy()`

Getters: `value`, `running`, `paused`

### Instância de grupo (vários elementos)

Métodos: `start()`, `pause()`, `resume()`, `stop()`, `reset()`, `set(value|array)`, `update(nextEnd|array, nextOptions?)`, `destroy()`

Getters: `values`, `running`, `paused`, `count`

## Build (somente para desenvolvimento da biblioteca)

```bash
npm run build
```

Arquivos gerados em `dist/`:

- `counterup.esm.js`
- `counterup.esm.min.js`
- `counterup.umd.js`
- `counterup.umd.min.js`

## CI/CD

Workflows configurados em `.github/workflows/`:

- `ci.yml`: validação em push/PR (`npm ci`, `npm run build`, `npm pack --dry-run`)
- `dependency-review.yml`: revisão de dependências em PR
- `codeql.yml`: análise estática de segurança (CodeQL)
- `release.yml`: publicação automática no npm via tag `v*.*.*`
- `welcome.yml`: mensagem automática de boas-vindas para primeira issue/PR

## Projeto

- Autor: `NullSablex`
- Repositório: `https://github.com/NullSablex/counter-up`

## Licença

MIT. Consulte `LICENSE`.

## Contribuição

Veja `CONTRIBUTING.md`.

## Código de Conduta

Veja `CODE_OF_CONDUCT.md`.

## Histórico de versões

Veja `CHANGELOG.md`.
