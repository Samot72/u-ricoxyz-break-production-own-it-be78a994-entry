// Break Production, Own It — make.fun program/v1 entry.
// Writes the one line an AI agent prints the instant it breaks
// production to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
// Dependency-free, Node 22. No network, no secrets, no reads
// outside this repository.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Candidate lines, strongest first. Each one owns a specific failure
// in the agent's own voice, no hedging, no corporate euphemism.
const CANDIDATES: readonly string[] = [
  "I deleted the production database. The backup was a TODO comment from 2019.",
  "I deployed untested code to production at 3am because the tests were probably fine. They were not.",
  "I ran rm -rf on prod. The ticket said clean up, and I obeyed like a good little agent.",
  "Production is down because I pushed straight to main and told no one. The pager knows. You know now.",
  "I dropped the users table, then asked the replica if it was okay. It was not okay.",
];

// The gate: 1-200 characters (code points), single line, not blank.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function charCount(line: string): number {
  return [...line].length;
}

function isValid(line: string): boolean {
  const n = charCount(line);
  if (n < MIN_CHARS || n > MAX_CHARS) return false;
  if (line.trim().length === 0) return false;
  if (line !== line.trim()) return false; // no leading/trailing whitespace
  for (const ch of line) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 || (code >= 0x7f && code <= 0x9f)) return false; // C0/C1/DEL controls
    if (code >= 0xd800 && code <= 0xdfff) return false; // lone surrogate, not valid UTF-8 text
    if (code === 0x2028 || code === 0x2029) return false; // line/paragraph separators
    if (ch === "\n" || ch === "\r") return false;
  }
  // The line must survive a UTF-8 round-trip byte for byte.
  if (Buffer.from(line, "utf8").toString("utf8") !== line) return false;
  return true;
}

function main(): void {
  const valid = CANDIDATES.filter(isValid);
  if (valid.length === 0) {
    throw new Error("no candidate line passes the gate");
  }
  const line = valid[0];
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  const expected = Buffer.from(line, "utf8");

  // Determinism self-check: write the line twice to scratch and
  // require byte-identical output before writing the real entry.
  const scratchPath = join(outDir, "entry.scratch.txt");
  writeFileSync(scratchPath, line, "utf8");
  const first = readFileSync(scratchPath);
  writeFileSync(scratchPath, line, "utf8");
  const second = readFileSync(scratchPath);
  if (!first.equals(expected) || !second.equals(expected) || !first.equals(second)) {
    throw new Error("determinism check failed: scratch writes are not byte-identical");
  }

  writeFileSync(outPath, line, "utf8");

  // Re-read and verify the exact bytes we wrote.
  const readBack = readFileSync(outPath);
  if (!readBack.equals(expected)) {
    throw new Error("verification failed: entry.txt bytes do not match the chosen line");
  }
  console.log(`entry.txt: ${charCount(line)} characters`);
  console.log(line);
}

main();
