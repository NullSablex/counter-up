import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { counterUp } from "../src/counterup.js";

function flushAnimation(durationMs = 2500) {
  vi.advanceTimersByTime(durationMs);
}

beforeEach(() => {
  vi.useFakeTimers();
  let frameTime = 0;
  vi.stubGlobal("requestAnimationFrame", (cb) => {
    return setTimeout(() => {
      frameTime += 16;
      cb(frameTime);
    }, 16);
  });
  vi.stubGlobal("cancelAnimationFrame", (id) => clearTimeout(id));
  document.body.innerHTML = "";
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("counterUp — DOM básico", () => {
  it("anima até end e formata com locale pt-BR", () => {
    const el = document.createElement("span");
    document.body.appendChild(el);

    const counter = counterUp(el, { start: 0, end: 1000, duration: 1000 });
    flushAnimation(1200);

    expect(counter.value).toBe(1000);
    expect(el.textContent).toBe("1.000");
  });

  it("respeita decimals e suffix/prefix", () => {
    const el = document.createElement("span");
    document.body.appendChild(el);

    counterUp(el, { end: 12.5, decimals: 2, prefix: "R$ ", suffix: " /mês", duration: 500 });
    flushAnimation(600);

    expect(el.textContent).toBe("R$ 12,50 /mês");
  });

  it("autostart: false não inicia até start()", () => {
    const el = document.createElement("span");
    el.textContent = "0";
    document.body.appendChild(el);

    const counter = counterUp(el, { end: 50, duration: 500, autostart: false });
    flushAnimation(600);
    expect(counter.value).toBe(0);

    counter.start();
    flushAnimation(600);
    expect(counter.value).toBe(50);
  });
});

describe("auto-detecção a partir do DOM", () => {
  it("infere end e decimals do textContent em pt-BR (vírgula decimal, ponto milhar)", () => {
    const el = document.createElement("span");
    el.textContent = "1.234,56";
    document.body.appendChild(el);

    const counter = counterUp(el, { duration: 500 });
    flushAnimation(600);

    expect(counter.value).toBeCloseTo(1234.56, 2);
    expect(el.textContent).toBe("1.234,56");
  });

  it("infere em en-US (ponto decimal, vírgula milhar)", () => {
    const el = document.createElement("span");
    el.textContent = "1,234.56";
    document.body.appendChild(el);

    const counter = counterUp(el, { duration: 500, locale: "en-US" });
    flushAnimation(600);

    expect(counter.value).toBeCloseTo(1234.56, 2);
    expect(el.textContent).toBe("1,234.56");
  });
});

describe("modo headless", () => {
  it("aceita target null com onUpdate/onComplete", () => {
    const onUpdate = vi.fn();
    const onComplete = vi.fn();

    const counter = counterUp(null, {
      end: 10,
      duration: 200,
      onUpdate,
      onComplete,
    });
    flushAnimation(300);

    expect(counter.value).toBe(10);
    expect(onUpdate).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith(10, null, 0);
  });
});

describe("ciclo de vida", () => {
  it("pause/resume preserva progresso", () => {
    const el = document.createElement("span");
    document.body.appendChild(el);

    const counter = counterUp(el, { end: 100, duration: 1000, easing: "linear" });
    flushAnimation(500);
    counter.pause();
    const mid = counter.value;
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(100);

    flushAnimation(2000);
    expect(counter.value).toBe(mid);

    counter.resume();
    flushAnimation(2000);
    expect(counter.value).toBe(100);
  });

  it("destroy impede reinício", () => {
    const el = document.createElement("span");
    document.body.appendChild(el);

    const counter = counterUp(el, { end: 100, duration: 500, autostart: false });
    counter.destroy();
    counter.start();
    flushAnimation(1000);
    expect(counter.value).toBe(0);
  });

  it("reset volta ao start", () => {
    const el = document.createElement("span");
    document.body.appendChild(el);
    const counter = counterUp(el, { start: 5, end: 50, duration: 200 });
    flushAnimation(300);
    expect(counter.value).toBe(50);
    counter.reset();
    expect(counter.value).toBe(5);
  });
});

describe("prefers-reduced-motion", () => {
  it("força duração 0 quando o usuário pediu redução de movimento", () => {
    vi.stubGlobal("matchMedia", (q) => ({
      matches: q.includes("reduce"),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));

    const el = document.createElement("span");
    document.body.appendChild(el);

    const counter = counterUp(el, { end: 999, duration: 5000 });
    flushAnimation(20);
    expect(counter.value).toBe(999);
  });

  it("ignora a preferência quando respectReducedMotion: false", () => {
    vi.stubGlobal("matchMedia", (q) => ({
      matches: q.includes("reduce"),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));

    const el = document.createElement("span");
    document.body.appendChild(el);

    const counter = counterUp(el, {
      end: 999,
      duration: 1000,
      respectReducedMotion: false,
    });
    flushAnimation(50);
    expect(counter.value).toBeLessThan(999);
  });
});

describe("formatter customizado", () => {
  it("substitui completamente a formatação padrão", () => {
    const el = document.createElement("span");
    document.body.appendChild(el);

    counterUp(el, {
      end: 42,
      duration: 200,
      formatter: (v) => `~${Math.round(v)}~`,
    });
    flushAnimation(300);

    expect(el.textContent).toBe("~42~");
  });
});

describe("grupo (múltiplos elementos)", () => {
  it("retorna API de grupo quando alvo é seletor com vários matches", () => {
    document.body.innerHTML = `<span class="c">10</span><span class="c">20</span>`;
    const group = counterUp(".c", { duration: 200 });
    flushAnimation(300);

    expect(group.count).toBe(2);
    expect(group.values).toEqual([10, 20]);
  });

  it("set([]) aplica por índice", () => {
    document.body.innerHTML = `<span class="c">0</span><span class="c">0</span>`;
    const group = counterUp(".c", { autostart: false });
    group.set([7, 13]);
    expect(group.values).toEqual([7, 13]);
  });
});

describe("startOnView + update()", () => {
  function makeIO() {
    const observed = new Set();
    let triggerEntry;
    const IO = vi.fn(function (cb) {
      this.observe = (el) => {
        observed.add(el);
        triggerEntry = (isIntersecting) => cb([{ isIntersecting, target: el }]);
      };
      this.disconnect = () => observed.clear();
      this.unobserve = (el) => observed.delete(el);
    });
    return {
      IO,
      observed,
      trigger: (isIntersecting) => triggerEntry?.(isIntersecting),
    };
  }

  it("update() re-anexa o observer quando startOnView está ativo", () => {
    const { IO, observed, trigger } = makeIO();
    vi.stubGlobal("IntersectionObserver", IO);

    const el = document.createElement("span");
    document.body.appendChild(el);

    const counter = counterUp(el, {
      end: 100,
      duration: 200,
      startOnView: true,
      once: false,
    });

    expect(observed.has(el)).toBe(true);
    trigger(true);
    flushAnimation(300);
    expect(counter.value).toBe(100);

    counter.update(500);

    expect(observed.has(el)).toBe(true);
    trigger(true);
    flushAnimation(300);
    expect(counter.value).toBe(500);
  });

  it("update() com once:true permite que a próxima entrada na viewport dispare de novo", () => {
    const { IO, trigger } = makeIO();
    vi.stubGlobal("IntersectionObserver", IO);

    const el = document.createElement("span");
    document.body.appendChild(el);

    const counter = counterUp(el, {
      end: 10,
      duration: 200,
      startOnView: true,
      once: true,
    });
    trigger(true);
    flushAnimation(300);
    expect(counter.value).toBe(10);

    counter.update(99);
    trigger(true);
    flushAnimation(300);
    expect(counter.value).toBe(99);
  });
});

describe("erros", () => {
  it("lança quando o seletor não casa nenhum elemento", () => {
    expect(() => counterUp(".nao-existe")).toThrow(/not found/);
  });
});
