/**
 * @nullsablex/counter-up — TypeScript declarations
 */

// ── Primitivos ────────────────────────────────────────────────────────────────

/** Função de easing personalizada. Recebe `t` (0–1) e retorna o valor eased (0–1). */
export type EasingFunction = (t: number) => number;

/** Nomes dos easings embutidos. */
export type EasingName =
  | "linear"
  | "easeInQuad"
  | "easeOutQuad"
  | "easeInOutQuad"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeOutQuart"
  | "easeOutExpo";

/**
 * Função de formatação personalizada.
 * Substitui toda a lógica padrão de formatação.
 * @param value   Valor numérico atual (sem formatação).
 * @param element Elemento DOM associado, ou `null` em modo headless.
 * @param index   Posição do elemento no grupo (0-based). `0` para instância única.
 */
export type FormatterFunction = (
  value: number,
  element: Element | null,
  index: number,
) => string;

/**
 * Função de callback chamada a cada frame (onUpdate) ou ao término (onComplete).
 * @param value   Valor numérico atual.
 * @param element Elemento DOM associado, ou `null` em modo headless.
 * @param index   Posição do elemento no grupo (0-based).
 */
export type CounterUpCallback = (
  value: number,
  element: Element | null,
  index: number,
) => void;

// ── Opções ────────────────────────────────────────────────────────────────────

export interface CounterUpOptions {
  /**
   * Valor inicial da animação. O contador começa exibindo este número.
   * @default 0
   */
  start?: number;

  /**
   * Valor final da animação.
   * Quando omitido e um elemento DOM é fornecido, a biblioteca lê o `textContent`
   * do elemento e usa esse valor como destino — ideal para conteúdo SSR/PHP.
   * Obrigatório em modo headless (`target = null`).
   * @default auto (lido do textContent do elemento)
   */
  end?: number;

  /**
   * Duração total da animação em milissegundos.
   * `0` pula diretamente para o valor final sem animação.
   * @default 2000
   */
  duration?: number;

  /**
   * Casas decimais exibidas.
   * Quando omitido junto com `end`, é inferido automaticamente do `textContent`
   * do elemento (ex.: `"15.50"` → `2`).
   * @default auto (inferido do textContent)
   */
  decimals?: number;

  /**
   * Texto adicionado **antes** do número formatado.
   * @example "R$ " | "$" | "€ "
   * @default ""
   */
  prefix?: string;

  /**
   * Texto adicionado **depois** do número formatado.
   * @example "%" | " pts" | " km"
   * @default ""
   */
  suffix?: string;

  /**
   * Locale para `Intl.NumberFormat`. Controla separadores decimal e de milhar.
   * @example "pt-BR" | "en-US" | "de-DE" | "fr-FR"
   * @default "pt-BR"
   */
  locale?: string;

  /**
   * Exibe separador de milhar conforme o locale (`1.000` vs `1000`).
   * @default true
   */
  useGrouping?: boolean;

  /**
   * Curva de aceleração da animação.
   * Aceita um nome de preset ou uma função `(t: number) => number` onde `t` vai de 0 a 1.
   * @default "easeOutCubic"
   */
  easing?: EasingName | EasingFunction;

  /**
   * Função de formatação personalizada. Substitui toda a lógica padrão.
   * Recebe `(value, element, index)` e deve retornar uma string.
   * @default null
   */
  formatter?: FormatterFunction | null;

  /**
   * Tempo de espera em milissegundos antes de a animação começar.
   * `0` inicia imediatamente. Cancelado por `.stop()`, `.pause()` ou `.destroy()`.
   * @default 0
   */
  sleep?: number;

  /**
   * Respeita a preferência do usuário em `prefers-reduced-motion: reduce`.
   * Quando `true` e o usuário pediu redução de movimento, a duração é forçada
   * a `0` (transição instantânea para o valor final).
   * @default true
   */
  respectReducedMotion?: boolean;

  /**
   * Inicia a animação automaticamente ao criar a instância.
   * Se `false`, aguarda uma chamada manual a `.start()`.
   * @default true
   */
  autostart?: boolean;

  /**
   * Usa `IntersectionObserver` para iniciar a animação somente quando o elemento
   * entra na viewport. Ignorado em modo headless (sem DOM).
   * @default false
   */
  startOnView?: boolean;

  /**
   * Usado com `startOnView`: se `true`, a animação dispara apenas na primeira vez.
   * Se `false`, reinicia toda vez que o elemento entrar na viewport.
   * @default true
   */
  once?: boolean;

  /**
   * Elemento raiz do `IntersectionObserver`. `null` usa o viewport da janela.
   * @default null
   */
  root?: Element | null;

  /**
   * Margem ao redor do root, no formato CSS.
   * @example "0px" | "0px 0px -100px 0px"
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * Fração do elemento que precisa estar visível para disparar.
   * `0.1` = 10%, `1` = 100% visível.
   * @default 0.1
   */
  threshold?: number | number[];

  /**
   * Chamado a cada frame da animação com `(value, element, index)`.
   * `element` é `null` em modo headless.
   * @default null
   */
  onUpdate?: CounterUpCallback | null;

  /**
   * Chamado uma vez quando a animação termina com `(value, element, index)`.
   * `element` é `null` em modo headless.
   * @default null
   */
  onComplete?: CounterUpCallback | null;
}

// ── Instância única ───────────────────────────────────────────────────────────

/** Instância retornada para um único elemento DOM ou em modo headless (`null`). */
export interface CounterUpInstance {
  /**
   * Inicia a animação.
   * Se estiver pausada, retoma do ponto onde parou.
   * Se já estiver rodando, não faz nada.
   */
  start(): CounterUpInstance;

  /** Para a animação e reseta o progresso interno (não reseta o valor exibido). */
  stop(): CounterUpInstance;

  /** Pausa a animação preservando o progresso atual. */
  pause(): CounterUpInstance;

  /** Retoma a animação do ponto em que foi pausada. */
  resume(): CounterUpInstance;

  /** Para a animação e volta o valor exibido para `start`. */
  reset(): CounterUpInstance;

  /**
   * Define o valor exibido instantaneamente, sem animação.
   * Para qualquer animação em curso.
   */
  set(value: number): CounterUpInstance;

  /**
   * Muda o valor final (e opcionalmente outras opções) e reinicia a animação
   * do valor atual.
   */
  update(nextEnd: number, nextOptions?: Partial<CounterUpOptions>): CounterUpInstance;

  /**
   * Para a animação, desconecta o observer e marca a instância como destruída.
   * Chamadas subsequentes a qualquer método são ignoradas.
   */
  destroy(): void;

  /** Valor numérico atual (sem formatação). */
  readonly value: number;

  /** `true` se a animação estiver em execução. */
  readonly running: boolean;

  /** `true` se a animação estiver pausada. */
  readonly paused: boolean;

  /** `true` se a animação estiver aguardando o `sleep` disparar. */
  readonly waiting: boolean;
}

// ── Instância de grupo ────────────────────────────────────────────────────────

/** Instância retornada quando múltiplos elementos são alvo da animação. */
export interface CounterUpGroupInstance {
  /** Chama `.start()` em todos os elementos. */
  start(): CounterUpGroupInstance;

  /** Chama `.stop()` em todos os elementos. */
  stop(): CounterUpGroupInstance;

  /** Chama `.pause()` em todos os elementos. */
  pause(): CounterUpGroupInstance;

  /** Chama `.resume()` em todos os elementos. */
  resume(): CounterUpGroupInstance;

  /** Chama `.reset()` em todos os elementos. */
  reset(): CounterUpGroupInstance;

  /** Chama `.destroy()` em todos os elementos. */
  destroy(): CounterUpGroupInstance;

  /**
   * Define um valor em cada elemento.
   * - Valor único: aplicado a todos.
   * - Array: cada elemento recebe o valor correspondente.
   */
  set(value: number | number[]): CounterUpGroupInstance;

  /**
   * Muda o valor final em cada elemento.
   * - Valor único: aplicado a todos.
   * - Array: cada elemento recebe o valor correspondente.
   *   Se o array for menor que o grupo, o último valor é repetido.
   */
  update(
    nextEnd: number | number[],
    nextOptions?: Partial<CounterUpOptions>,
  ): CounterUpGroupInstance;

  /** Array com o valor atual de cada elemento. */
  readonly values: number[];

  /** `true` se ao menos um elemento estiver animando. */
  readonly running: boolean;

  /** `true` se ao menos um elemento estiver pausado. */
  readonly paused: boolean;

  /** `true` se ao menos um elemento estiver aguardando o `sleep` disparar. */
  readonly waiting: boolean;

  /** Quantidade de elementos no grupo. */
  readonly count: number;
}

// ── Target ────────────────────────────────────────────────────────────────────

/** Tipos aceitos como `target` pela função `counterUp`. */
export type CounterUpTarget =
  | string
  | Element
  | NodeList
  | HTMLCollection
  | Element[]
  | null
  | undefined;

// ── Função principal ──────────────────────────────────────────────────────────

/**
 * Modo headless — sem elemento DOM.
 * Os valores são entregues exclusivamente pelo callback `onUpdate`.
 * Funciona em Node.js, Next.js, Nuxt, Vitest sem jsdom.
 */
export function counterUp(
  target: null | undefined,
  options?: CounterUpOptions,
): CounterUpInstance;

/**
 * Elemento DOM único — retorna uma instância única.
 */
export function counterUp(
  target: Element,
  options?: CounterUpOptions,
): CounterUpInstance;

/**
 * Seletor CSS, NodeList, HTMLCollection ou array de elementos.
 * Retorna instância única se um elemento for encontrado, instância de grupo se houver mais de um.
 */
export function counterUp(
  target: string | NodeList | HTMLCollection | Element[],
  options?: CounterUpOptions,
): CounterUpInstance | CounterUpGroupInstance;

export default counterUp;
