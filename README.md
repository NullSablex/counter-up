# Counter Up

Biblioteca JavaScript para animação de números no DOM, sem dependências externas.

## Recursos

- JavaScript puro (sem jQuery)
- Suporte a `id`, `class`, elemento DOM, `NodeList` e array de elementos
- Formatação com `Intl.NumberFormat`
- Saída ESM e UMD (normal e minificada)

## Instalação

```bash
npm install counter-up
```

## Uso

### ESM (elemento único)

```js
import { counterUp } from "counter-up";

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
import { counterUp } from "counter-up";

const counters = counterUp(".metric", {
  start: 0,
  end: 1200,
  duration: 1400,
});

counters.update([100, 250, 999]);
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
- `onUpdate` (function)
- `onComplete` (function)

`formatter`, `onUpdate` e `onComplete` recebem: `(value, element, index)`.

### Instância (1 elemento)

Métodos: `start()`, `pause()`, `resume()`, `stop()`, `reset()`, `set(value)`, `update(nextEnd, nextOptions?)`, `destroy()`

Getters: `value`, `running`, `paused`

### Instância de grupo (vários elementos)

Métodos: `start()`, `pause()`, `resume()`, `stop()`, `reset()`, `set(value|array)`, `update(nextEnd|array, nextOptions?)`, `destroy()`

Getters: `values`, `running`, `paused`, `count`

## Build

```bash
npm run build
```

Arquivos gerados em `dist/`:

- `counterup.esm.js`
- `counterup.esm.min.js`
- `counterup.umd.js`
- `counterup.umd.min.js`

## Projeto

- Autor: `NullSablex`
- Repositório: `https://github.com/NullSablex/counter-up`

## Licença

MIT. Consulte `LICENSE`.

## Contribuição

Veja `CONTRIBUTING.md`.

## Histórico de versões

Veja `CHANGELOG.md`.
