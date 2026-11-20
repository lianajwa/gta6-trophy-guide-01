// Vice Platinum — the entry program for make.fun (Node 22, standard library only).
// The guide is plain static files under app/ (index.html, its modules, styles and
// data/trophies.json), it loads nothing over the network, and screenshots/ holds
// 3 or 4 real renders of it. This program hands the entry in: it copies app/
// and screenshots/ from beside this file into the output directory and writes
// output/dossier.json with the vendored make.fun library, which is the summary
// the judge reads (screenshots, first-load bytes, and the guide's source).
// vendor/makefun-frontend.ts is left exactly as the kit shipped it: the sealed
// scorer rebuilds the dossier with its own copy and compares the two byte for byte.
//
// Run it locally to check the entry:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.
// The run is deterministic: two runs write identical bytes.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from a clean output directory so a stale file can never ride along.
if (existsSync(outputDir)) rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

// The guide itself.
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

// Its screenshots (the first by name is the cover).
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The dossier, built with the kit's library and the scorer's own caps:
// at most 4 screenshots of 256 KiB each, app/ at most 993 files and
// directories and 48 MiB, the dossier text at most 160 KiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`Vice Platinum entry written to ${outputDir}`);
