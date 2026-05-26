const raf = (cb) =>
  typeof requestAnimationFrame !== "undefined"
    ? requestAnimationFrame(cb)
    : setTimeout(() => cb(Date.now()), 16);

const caf = (id) =>
  typeof cancelAnimationFrame !== "undefined"
    ? cancelAnimationFrame(id)
    : clearTimeout(id);

const easings = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const defaultOptions = {
  start: 0,
  end: 100,
  duration: 2000,
  decimals: 0,
  prefix: "",
  suffix: "",
  locale: "pt-BR",
  useGrouping: true,
  easing: "easeOutCubic",
  formatter: null,
  sleep: 0,
  respectReducedMotion: true,
  autostart: true,
  startOnView: false,
  once: true,
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
  onUpdate: null,
  onComplete: null,
};

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function resolveEasing(easing) {
  if (typeof easing === "function") return easing;
  return easings[easing] || easings.easeOutCubic;
}

function shouldReduceMotion(options) {
  return options.respectReducedMotion !== false && prefersReducedMotion();
}

function normalizeOptions(options) {
  const requestedDuration = Math.max(
    0,
    toNumber(options.duration, defaultOptions.duration),
  );

  const normalized = {
    ...options,
    start: toNumber(options.start, defaultOptions.start),
    end: toNumber(options.end, defaultOptions.end),
    duration: shouldReduceMotion(options) ? 0 : requestedDuration,
    decimals: Math.max(0, Math.floor(toNumber(options.decimals, defaultOptions.decimals))),
  };

  normalized.easingFn = resolveEasing(normalized.easing);
  normalized.numberFormat = new Intl.NumberFormat(normalized.locale, {
    minimumFractionDigits: normalized.decimals,
    maximumFractionDigits: normalized.decimals,
    useGrouping: normalized.useGrouping,
  });

  return normalized;
}

function getLocaleSeparators(locale) {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(1234.5);
    const decimal = parts.find((p) => p.type === "decimal")?.value || ".";
    const group = parts.find((p) => p.type === "group")?.value || ",";
    return { decimal, group };
  } catch {
    return { decimal: ".", group: "," };
  }
}

function formatNumber(value, options) {
  if (typeof options.formatter === "function") {
    return options.formatter(value, options.element, options.index);
  }

  return `${options.prefix}${options.numberFormat.format(value)}${options.suffix}`;
}

function isElement(target) {
  return typeof Element !== "undefined" && target instanceof Element;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripToNumericTokens(text, groupSeparator) {
  const groupRe = new RegExp(escapeRegExp(groupSeparator), "g");
  return text.trim().replace(/[^\d.,-]/g, "").replace(groupRe, "");
}

function readElementValue(element, locale) {
  const { decimal, group } = getLocaleSeparators(locale);
  const cleaned = stripToNumericTokens(element.textContent || "", group);
  if (!cleaned) return null;

  const n = parseFloat(cleaned.replace(decimal, "."));
  return Number.isFinite(n) ? n : null;
}

function readElementDecimals(element, locale) {
  const { decimal, group } = getLocaleSeparators(locale);
  const cleaned = stripToNumericTokens(element.textContent || "", group);
  const idx = cleaned.indexOf(decimal);
  return idx === -1 ? 0 : cleaned.length - idx - 1;
}

function resolveElements(target) {
  if (target == null) {
    return [null];
  }

  if (typeof target === "string") {
    if (typeof document === "undefined") {
      throw new Error(
        "counterUp: `document` não está disponível neste ambiente. " +
          "Passe um elemento DOM diretamente ou use modo headless (target null + onUpdate)."
      );
    }
    return Array.from(document.querySelectorAll(target));
  }

  if (isElement(target)) {
    return [target];
  }

  if (Array.isArray(target)) {
    return target.filter(isElement);
  }

  if (
    typeof NodeList !== "undefined" &&
    (target instanceof NodeList ||
      (typeof HTMLCollection !== "undefined" && target instanceof HTMLCollection))
  ) {
    return Array.from(target).filter(isElement);
  }

  return [];
}

function createCounterInstance(element, userOptions = {}, index = 0) {
  if (element !== null && !isElement(element)) {
    throw new Error("counterUp: target element not found.");
  }

  const inferLocale = userOptions.locale ?? defaultOptions.locale;
  const autoEnd =
    element !== null && userOptions.end === undefined
      ? readElementValue(element, inferLocale)
      : null;

  const autoDecimals =
    autoEnd !== null && userOptions.decimals === undefined
      ? readElementDecimals(element, inferLocale)
      : null;

  let options = normalizeOptions({
    ...defaultOptions,
    ...(autoEnd !== null ? { end: autoEnd } : {}),
    ...(autoDecimals !== null ? { decimals: autoDecimals } : {}),
    ...userOptions,
    element,
    index,
  });

  const state = {
    value: options.start,
    from: options.start,
    to: options.end,
    elapsed: 0,
    startTime: null,
    rafId: null,
    sleepId: null,
    isRunning: false,
    isPaused: false,
    destroyed: false,
    hasPlayed: false,
    observer: null,
  };

  function render(value, notify = true) {
    state.value = value;
    if (element !== null) {
      element.textContent = formatNumber(value, options);
    }
    if (notify && typeof options.onUpdate === "function") {
      options.onUpdate(value, element, index);
    }
  }

  function cancelFrame() {
    if (state.rafId !== null) {
      caf(state.rafId);
      state.rafId = null;
    }
  }

  function clearSleep() {
    if (state.sleepId !== null) {
      clearTimeout(state.sleepId);
      state.sleepId = null;
    }
  }

  function disconnectObserver() {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
  }

  function animate(timestamp) {
    if (!state.isRunning || state.destroyed) return;

    if (state.startTime === null) {
      state.startTime = timestamp - state.elapsed;
    }

    state.elapsed = timestamp - state.startTime;
    const progress =
      options.duration === 0 ? 1 : Math.min(state.elapsed / options.duration, 1);
    const eased = options.easingFn(progress);
    const nextValue = state.from + (state.to - state.from) * eased;

    render(nextValue);

    if (progress < 1) {
      state.rafId = raf(animate);
      return;
    }

    state.isRunning = false;
    state.isPaused = false;
    state.elapsed = 0;
    state.startTime = null;
    render(state.to);
    if (typeof options.onComplete === "function") {
      options.onComplete(state.to, element, index);
    }
  }

  function play(from, to) {
    if (state.destroyed) return api;
    clearSleep();
    cancelFrame();
    state.from = toNumber(from, state.value);
    state.to = toNumber(to, state.to);
    state.elapsed = 0;
    state.startTime = null;
    state.isPaused = false;
    state.hasPlayed = true;

    const sleepMs = Math.max(0, toNumber(options.sleep, 0));
    if (sleepMs > 0) {
      state.sleepId = setTimeout(() => {
        state.sleepId = null;
        state.isRunning = true;
        state.rafId = raf(animate);
      }, sleepMs);
    } else {
      state.isRunning = true;
      state.rafId = raf(animate);
    }

    return api;
  }

  function stop() {
    clearSleep();
    cancelFrame();
    state.isRunning = false;
    state.isPaused = false;
    state.elapsed = 0;
    state.startTime = null;
    return api;
  }

  function start() {
    if (state.destroyed) return api;
    if (options.startOnView && options.once) {
      disconnectObserver();
    }
    if (state.isPaused) {
      return resume();
    }
    if (state.isRunning) {
      return api;
    }
    return play(options.start, options.end);
  }

  function pause() {
    if (state.sleepId !== null) {
      clearSleep();
      state.isPaused = true;
      return api;
    }
    if (!state.isRunning) return api;
    cancelFrame();
    state.isRunning = false;
    state.isPaused = true;
    // Keep elapsed progress, but force startTime recalculation on resume.
    state.startTime = null;
    return api;
  }

  function resume() {
    if (!state.isPaused || state.destroyed) return api;
    state.isRunning = true;
    state.isPaused = false;
    // Re-anchor startTime using the saved elapsed time.
    state.startTime = null;
    state.rafId = raf(animate);
    return api;
  }

  function reset() {
    stop();
    render(options.start, false);
    return api;
  }

  function set(value) {
    const nextValue = toNumber(value, state.value);
    stop();
    state.from = nextValue;
    state.to = nextValue;
    render(nextValue);
    return api;
  }

  function update(nextEnd, nextOptions = {}) {
    if (state.destroyed) return api;
    stop();
    disconnectObserver();
    options = normalizeOptions({
      ...options,
      ...nextOptions,
      element,
      index,
      start:
        nextOptions.start === undefined ? state.value : toNumber(nextOptions.start),
      end: toNumber(nextEnd, options.end),
    });

    if (options.startOnView && element !== null) {
      state.hasPlayed = false;
      setupObserver();
      return api;
    }

    return play(options.start, options.end);
  }

  function destroy() {
    stop();
    disconnectObserver();
    state.destroyed = true;
  }

  function setupObserver() {
    if (
      !options.startOnView ||
      !options.autostart ||
      element === null ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    disconnectObserver();
    state.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          if (options.once && state.hasPlayed) {
            return;
          }
          render(options.start, false);
          play(options.start, options.end);
          if (options.once) {
            disconnectObserver();
          }
          return;
        }

        if (!options.once) {
          stop();
          render(options.start, false);
        }
      },
      {
        root: options.root,
        rootMargin: options.rootMargin,
        threshold: options.threshold,
      }
    );

    state.observer.observe(element);
  }

  const api = {
    start,
    stop,
    pause,
    resume,
    reset,
    set,
    update,
    destroy,
    get value() {
      return state.value;
    },
    get running() {
      return state.isRunning;
    },
    get paused() {
      return state.isPaused;
    },
    get waiting() {
      return state.sleepId !== null;
    },
  };

  render(options.start, false);
  if (options.startOnView) {
    setupObserver();
  } else if (options.autostart) {
    start();
  }

  return api;
}

function pickValueForIndex(values, index, fallback = 0) {
  return values[index] ?? values[values.length - 1] ?? fallback;
}

function createGroupInstance(elements, userOptions) {
  const instances = elements.map((element, index) =>
    createCounterInstance(element, userOptions, index),
  );

  const broadcast = (method) => {
    instances.forEach((instance) => instance[method]());
    return api;
  };

  const api = {
    start: () => broadcast("start"),
    stop: () => broadcast("stop"),
    pause: () => broadcast("pause"),
    resume: () => broadcast("resume"),
    reset: () => broadcast("reset"),
    destroy: () => broadcast("destroy"),
    set(value) {
      const perIndex = Array.isArray(value);
      instances.forEach((instance, index) => {
        instance.set(perIndex ? pickValueForIndex(value, index) : value);
      });
      return api;
    },
    update(nextEnd, nextOptions = {}) {
      const perIndex = Array.isArray(nextEnd);
      instances.forEach((instance, index) => {
        const target = perIndex ? pickValueForIndex(nextEnd, index) : nextEnd;
        instance.update(target, nextOptions);
      });
      return api;
    },
    get values() {
      return instances.map((instance) => instance.value);
    },
    get running() {
      return instances.some((instance) => instance.running);
    },
    get paused() {
      return instances.some((instance) => instance.paused);
    },
    get waiting() {
      return instances.some((instance) => instance.waiting);
    },
    get count() {
      return instances.length;
    },
  };

  return api;
}

export function counterUp(target, userOptions = {}) {
  const elements = resolveElements(target);

  if (elements.length === 0) {
    throw new Error("counterUp: target element not found.");
  }

  if (elements.length === 1) {
    return createCounterInstance(elements[0], userOptions, 0);
  }

  return createGroupInstance(elements, userOptions);
}

export default counterUp;
