import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const srcPath = resolve(root, "src/counterup.js");
const distDir = resolve(root, "dist");
const pkgPath = resolve(root, "package.json");

function createBanner(pkg) {
  const name = pkg.name || "counter-up";
  const version = pkg.version || "0.0.0";
  const author = pkg.author || "Unknown";
  const repo = pkg.repository?.url || "";
  const license = pkg.license || "UNLICENSED";
  return `/* ${name} v${version} | Author: ${author} | ${repo} | ${license} License */\n`;
}

function toUmdSource(esmSource) {
  const body = esmSource
    .replace("export function counterUp", "function counterUp")
    .replace("\nexport default counterUp;\n", "\n");

  return `(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else {
    global.CounterUp = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";
${indent(body, 2)}
  return { counterUp: counterUp, default: counterUp };
});
`;
}

function indent(content, spaces = 2) {
  const prefix = " ".repeat(spaces);
  return content
    .split("\n")
    .map((line) => (line.length > 0 ? `${prefix}${line}` : line))
    .join("\n");
}

function minifyJs(source) {
  let out = "";
  let i = 0;
  let quote = "";
  let inLineComment = false;
  let inBlockComment = false;

  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (char === "\n") {
        inLineComment = false;
        out += "\n";
      }
      i += 1;
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false;
        i += 2;
        continue;
      }
      i += 1;
      continue;
    }

    if (!quote && char === "/" && next === "/") {
      inLineComment = true;
      i += 2;
      continue;
    }

    if (!quote && char === "/" && next === "*") {
      inBlockComment = true;
      i += 2;
      continue;
    }

    if (!quote && (char === "'" || char === '"' || char === "`")) {
      quote = char;
      out += char;
      i += 1;
      continue;
    }

    if (quote) {
      out += char;
      if (char === "\\") {
        out += source[i + 1] || "";
        i += 2;
        continue;
      }
      if (char === quote) {
        quote = "";
      }
      i += 1;
      continue;
    }

    if (/\s/.test(char)) {
      const prev = out[out.length - 1] || "";
      const nextNonSpace = nextNonWhitespace(source, i + 1);
      if (needsSpace(prev, nextNonSpace)) {
        out += " ";
      }
      i += 1;
      continue;
    }

    out += char;
    i += 1;
  }

  return out.trim();
}

function nextNonWhitespace(str, from) {
  for (let i = from; i < str.length; i += 1) {
    if (!/\s/.test(str[i])) return str[i];
  }
  return "";
}

function needsSpace(prev, next) {
  if (!prev || !next) return false;
  const isWord = (c) => /[A-Za-z0-9_$]/.test(c);
  return isWord(prev) && isWord(next);
}

async function build() {
  const pkgRaw = await readFile(pkgPath, "utf8");
  const pkg = JSON.parse(pkgRaw);
  const banner = createBanner(pkg);

  const esmSource = await readFile(srcPath, "utf8");
  const umdSource = toUmdSource(esmSource);

  const esmMin = minifyJs(esmSource);
  const umdMin = minifyJs(umdSource);

  await mkdir(distDir, { recursive: true });

  await writeFile(resolve(distDir, "counterup.esm.js"), `${banner}${esmSource}`);
  await writeFile(resolve(distDir, "counterup.esm.min.js"), `${banner}${esmMin}`);
  await writeFile(resolve(distDir, "counterup.umd.js"), `${banner}${umdSource}`);
  await writeFile(resolve(distDir, "counterup.umd.min.js"), `${banner}${umdMin}`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
