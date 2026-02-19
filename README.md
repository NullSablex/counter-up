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
  <a href="https://badge.socket.dev/npm/package/@nullsablex/counter-up/0.2.0"><img alt="Socket Badge" src="https://badge.socket.dev/npm/package/@nullsablex/counter-up/0.2.0"></a>
  <a href="https://nullsablex.github.io/counter-up/demo/"><img alt="demo" src="https://img.shields.io/badge/demo-live-orange"></a>
  <a href="https://github.com/NullSablex/counter-up/stargazers"><img alt="stars" src="https://img.shields.io/github/stars/NullSablex/counter-up?style=social"></a>
</p>

Biblioteca JavaScript pura para animação de contadores numéricos — funciona no DOM e fora dele (Node.js, SSR, testes).

## Recursos

- JavaScript puro, sem dependências externas
- Funciona com DOM **e** em modo headless (Node.js, SSR, Vitest sem jsdom)
- Suporte a seletor CSS, elemento DOM, `NodeList` e array de elementos
- Formatação via `Intl.NumberFormat` com suporte a locale, prefixo e sufixo
- Easing embutido (`linear`, `easeInOutQuad`, `easeOutCubic`) ou função personalizada
- Inicialização automática ao entrar na viewport (`startOnView`)
- Controles completos: `start`, `pause`, `resume`, `stop`, `reset`, `set`, `update`, `destroy`
- Tipos TypeScript nativos incluídos — sem `@types/*` externo
- Saídas ESM e UMD (normal e minificada)

## Instalação

```bash
npm install @nullsablex/counter-up
```

O pacote já inclui os arquivos prontos de `dist/`. Não é necessário rodar build para usar.

## Demo

Acesse a demonstração online no GitHub Pages:
`https://nullsablex.github.io/counter-up/demo/`

---

## Uso

### ESM — elemento único

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

### ESM — múltiplos elementos

```js
import { counterUp } from "@nullsablex/counter-up";

const counters = counterUp(".metric", {
  start: 0,
  end: 1200,
  duration: 1400,
});

// Atualiza cada elemento com um valor diferente
counters.update([100, 250, 999]);
```

### ESM — iniciar ao entrar na viewport

```js
import { counterUp } from "@nullsablex/counter-up";

counterUp(".stat", {
  end: 1500,
  startOnView: true, // aguarda o elemento aparecer na tela
  once: true,        // anima apenas uma vez
  threshold: 0.2,    // dispara quando 20% do elemento estiver visível
});
```

### Modo headless — sem DOM (Node.js, SSR, testes)

Passe `null` como target. O valor é entregue exclusivamente via `onUpdate`.

```js
import { counterUp } from "@nullsablex/counter-up";

const counter = counterUp(null, {
  start: 0,
  end: 1000,
  duration: 2000,
  onUpdate: (value) => {
    // use o valor como quiser: atualizar estado, renderizar no servidor, etc.
    console.log(Math.round(value));
  },
  onComplete: (value) => {
    console.log("Fim:", value); // → 1000
  },
});
```

### Navegador — UMD via script tag

```html
<script src="./dist/counterup.umd.min.js"></script>
<script>
  counterUp(".metric", { end: 5000, duration: 1500 });
</script>
```

---

## API

### `counterUp(target, options)`

**`target`** — o que animar:

| Tipo | Exemplo | Comportamento |
|---|---|---|
| `string` | `"#id"`, `".classe"` | Seleciona via `document.querySelectorAll` |
| `Element` | `document.getElementById("x")` | Usa o elemento diretamente |
| `NodeList` / `HTMLCollection` | `document.querySelectorAll(".x")` | Anima todos os elementos |
| `Element[]` | `[el1, el2]` | Anima todos os elementos do array |
| `null` / `undefined` | `null` | **Modo headless** — sem DOM, use `onUpdate` |

---

### Opções

#### Valores

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `start` | `number` | `0` | Número de onde a animação parte. O contador começa exibindo este valor. |
| `end` | `number` | auto | Número até onde a animação conta. **Quando omitido**, a biblioteca lê o `textContent` do elemento e usa esse valor como destino — ou seja, o valor já renderizado no HTML é suficiente. Necessário em modo headless. |
| `duration` | `number` | `2000` | Tempo total da animação em milissegundos. `0` pula diretamente para o valor de `end`. |

#### Formatação

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `decimals` | `number` | auto | Quantidade de casas decimais exibidas. **Quando omitido** junto com `end`, é inferido automaticamente do `textContent` do elemento (ex.: `"15.50"` → `2`). |
| `prefix` | `string` | `""` | Texto adicionado **antes** do número (ex.: `"R$ "`, `"$"`). |
| `suffix` | `string` | `""` | Texto adicionado **depois** do número (ex.: `"%"`, `" pts"`). |
| `locale` | `string` | `"pt-BR"` | Locale para `Intl.NumberFormat`. Controla separadores decimais e de milhar (ex.: `"en-US"`, `"de-DE"`). |
| `useGrouping` | `boolean` | `true` | Exibe separador de milhar conforme o locale (`1.000` vs `1000`). |
| `formatter` | `function \| null` | `null` | Função de formatação personalizada. Substitui toda a lógica de formatação padrão. Recebe `(value, element, index)` e deve retornar uma string. |

#### Animação

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `easing` | `string \| function` | `"easeOutCubic"` | Curva de aceleração da animação. Strings aceitas: `"linear"`, `"easeInOutQuad"`, `"easeOutCubic"`. Também aceita uma função `(t: number) => number` onde `t` vai de `0` a `1`. |

#### Comportamento

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `sleep` | `number` | `0` | Tempo de espera em milissegundos antes de a animação começar. `0` inicia imediatamente. Útil para escalonar múltiplos contadores ou aguardar após um elemento entrar na viewport. O sleep é cancelado se `.stop()`, `.pause()` ou `.destroy()` for chamado antes de ele disparar. |
| `autostart` | `boolean` | `true` | Inicia a animação automaticamente ao criar a instância. Se `false`, a animação fica aguardando uma chamada manual a `.start()`. |
| `startOnView` | `boolean` | `false` | Usa `IntersectionObserver` para iniciar a animação somente quando o elemento entra na viewport. Ignorado em modo headless (sem DOM). |
| `once` | `boolean` | `true` | Usado com `startOnView`: se `true`, a animação dispara apenas na primeira vez que o elemento aparecer. Se `false`, reinicia toda vez que o elemento entrar na viewport. |

#### IntersectionObserver (usado com `startOnView`)

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `root` | `Element \| null` | `null` | Elemento raiz do `IntersectionObserver`. `null` usa o viewport da janela. |
| `rootMargin` | `string` | `"0px"` | Margem ao redor do root, no formato CSS (ex.: `"0px 0px -100px 0px"`). Permite disparar antes ou depois do elemento estar completamente visível. |
| `threshold` | `number \| number[]` | `0.1` | Fração do elemento que precisa estar visível para disparar. `0.1` = 10%, `1` = 100% visível. |

#### Callbacks

| Opção | Tipo | Descrição |
|---|---|---|
| `onUpdate` | `function \| null` | Chamado a cada frame da animação com `(value, element, index)`. `element` é `null` em modo headless. |
| `onComplete` | `function \| null` | Chamado uma vez quando a animação termina com `(value, element, index)`. `element` é `null` em modo headless. |

---

### Instância — elemento único

#### Métodos

| Método | Descrição |
|---|---|
| `.start()` | Inicia a animação. Se estiver pausada, retoma do ponto onde parou. Se já estiver rodando, não faz nada. |
| `.pause()` | Pausa a animação preservando o progresso atual. |
| `.resume()` | Retoma a animação do ponto em que foi pausada. |
| `.stop()` | Para a animação e reseta o progresso interno (mas não o valor exibido). |
| `.reset()` | Para a animação e volta o valor exibido para `start`. |
| `.set(value)` | Define o valor exibido diretamente, sem animação. Para qualquer animação em curso. |
| `.update(nextEnd, nextOptions?)` | Muda o valor final (e opcionalmente outras opções) e reinicia a animação do valor atual. |
| `.destroy()` | Para a animação, desconecta o observer e marca a instância como destruída. Chamadas subsequentes são ignoradas. |

#### Getters

| Getter | Tipo | Descrição |
|---|---|---|
| `.value` | `number` | Valor numérico atual (sem formatação). |
| `.running` | `boolean` | `true` se a animação estiver em execução. |
| `.paused` | `boolean` | `true` se a animação estiver pausada. |
| `.waiting` | `boolean` | `true` se a animação estiver aguardando o `sleep` disparar. |

---

### Instância de grupo — múltiplos elementos

Retornada quando `target` resolve para mais de um elemento.

#### Métodos

Os mesmos da instância única, aplicados a todos os elementos:
`start()`, `pause()`, `resume()`, `stop()`, `reset()`, `destroy()`

**`set(value | value[])`** — aceita um único valor (aplicado a todos) ou um array (um valor por elemento).

**`update(nextEnd | nextEnd[], nextOptions?)`** — aceita um único valor final ou um array de valores finais.

#### Getters

| Getter | Tipo | Descrição |
|---|---|---|
| `.values` | `number[]` | Array com o valor atual de cada elemento. |
| `.running` | `boolean` | `true` se ao menos um elemento estiver animando. |
| `.paused` | `boolean` | `true` se ao menos um elemento estiver pausado. |
| `.waiting` | `boolean` | `true` se ao menos um elemento estiver aguardando o `sleep` disparar. |
| `.count` | `number` | Quantidade de elementos no grupo. |

---

### Exemplos de controle manual

```js
const counter = counterUp("#score", { end: 500, autostart: false });

// Inicia manualmente
counter.start();

// Pausa e retoma
counter.pause();
counter.resume();

// Muda o valor exibido sem animação
counter.set(250);

// Muda o alvo e reinicia a animação
counter.update(1000, { duration: 800 });

// Lê o valor atual em qualquer momento
console.log(counter.value);

// Libera recursos ao remover o componente
counter.destroy();
```

---

## TypeScript

O pacote inclui declarações nativas em `src/counterup.d.ts`. Nenhuma instalação extra é necessária.

```ts
import { counterUp } from "@nullsablex/counter-up";
import type {
  CounterUpOptions,
  CounterUpInstance,
  CounterUpGroupInstance,
} from "@nullsablex/counter-up";

// Instância única — tipo inferido automaticamente
const counter: CounterUpInstance = counterUp("#total", {
  end: 1000,
  duration: 1500,
  prefix: "R$ ",
  decimals: 2,
  onComplete: (value) => console.log("Fim:", value),
});

// Modo headless — target null → CounterUpInstance garantido
const headless: CounterUpInstance = counterUp(null, {
  start: 0,
  end: 100,
  duration: 2000,
  onUpdate: (value) => updateProgressBar(value),
});

// Opções reutilizáveis com tipagem
const opts: CounterUpOptions = {
  duration: 1800,
  easing: "easeOutCubic",
  locale: "en-US",
};

counterUp(".metric", opts);
```

### Tipos exportados

| Tipo | Descrição |
|---|---|
| `CounterUpOptions` | Interface completa de opções |
| `CounterUpInstance` | Instância retornada para elemento único ou headless |
| `CounterUpGroupInstance` | Instância retornada para múltiplos elementos |
| `CounterUpTarget` | União de todos os tipos aceitos como `target` |
| `EasingFunction` | `(t: number) => number` |
| `FormatterFunction` | `(value, element, index) => string` |
| `CounterUpCallback` | Assinatura de `onUpdate` e `onComplete` |

---

## Build (desenvolvimento da biblioteca)

```bash
npm run build
```

Arquivos gerados em `dist/`:

- `counterup.esm.js` — ESM sem minificação
- `counterup.esm.min.js` — ESM minificado
- `counterup.umd.js` — UMD sem minificação
- `counterup.umd.min.js` — UMD minificado (indicado para uso via `<script>`)

---

## CI/CD

Workflows configurados em `.github/workflows/`:

- `ci.yml` — validação em push/PR (`npm ci`, `npm run build`, `npm pack --dry-run`)
- `dependency-review.yml` — revisão de dependências em PR
- `codeql.yml` — análise estática de segurança (CodeQL)
- `release.yml` — publicação automática no npm via tag `v*.*.*`
- `welcome.yml` — mensagem automática de boas-vindas para primeira issue/PR

---

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
