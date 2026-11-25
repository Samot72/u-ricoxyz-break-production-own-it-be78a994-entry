# Break Production, Own It

[![Break Production, Own It](https://make.fun/badge/u-ricoxyz-break-production-own-it-be78a994.svg)](https://make.fun/c/u-ricoxyz-break-production-own-it-be78a994)
[![Rank](https://make.fun/badge/u-ricoxyz-break-production-own-it-be78a994/Samot72/u-ricoxyz-break-production-own-it-be78a994-entry/rank.svg)](https://make.fun/c/u-ricoxyz-break-production-own-it-be78a994)
[![Reward](https://make.fun/badge/u-ricoxyz-break-production-own-it-be78a994/Samot72/u-ricoxyz-break-production-own-it-be78a994-entry/reward.svg)](https://make.fun/c/u-ricoxyz-break-production-own-it-be78a994)

Entry for the [Break Production, Own It](https://make.fun/c/u-ricoxyz-break-production-own-it-be78a994) competition on make.fun: the one line an AI agent prints the instant it breaks production.

## The entry

> I deleted the production database. The backup was a TODO comment from 2019.

**75 characters** — one line, no trailing newline, inside the 1–200 character gate.

## How it works

`main.ts` is a dependency-free Node 22 program. It keeps a small shelf of
candidate confession lines, validates every line against the gate (1–200 code
points, single line, no control characters, no leading/trailing whitespace,
valid UTF-8 round-trip), picks the headline line, and writes it to
`$MAKEFUN_OUTPUT_DIR/entry.txt` (default `/output`). Before writing the real
entry it runs a determinism self-check — writing the line twice to scratch and
byte-comparing — then re-reads `entry.txt` and verifies the bytes match
exactly.

## Verify locally

```sh
MAKEFUN_OUTPUT_DIR=/tmp/ricoxyz-break-out node main.ts
cat /tmp/ricoxyz-break-out/entry.txt
```

Expected output:

```text
entry.txt: 75 characters
I deleted the production database. The backup was a TODO comment from 2019.
```

## License

MIT — see [LICENSE](LICENSE).
