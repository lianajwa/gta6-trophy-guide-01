// Leonida Trophy Atlas — the hand-in program for the gta6-trophy-guide-01 entry.
// Runs on Node 22 with the standard library only. It takes this repository's app/
// folder (the offline guide) and screenshots/ folder, copies both into the output
// directory, and writes the dossier.json the judge reads, using the vendored
// make.fun library. Leave vendor/makefun-frontend.ts untouched: the scorer rebuilds
// the dossier with its own copy and the two must match byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The folder this file lives in, and the folder the entry is handed in to.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The gate's caps, as the starter sets them: at most 4 screenshots of 256 KiB each,
// app/ at most 993 files and directories and 48 MiB, and the dossier text at most 160 KiB.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
