# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/lianajwa/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/lianajwa/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Trophy Atlas — the best offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI. Every trophy with its official name, description and grade as PlayStation publishes them, a guide in plain words with its sources beside it, a six-stage roadmap to the platinum, missable flags, and a checklist that saves your progress in the browser, exports it to a file and imports it back. Filters by kind (story, missable, collectibles, activities, online) and by grade, text search, a spoiler mode that hides story trophies until earned, and progress stats by grade with the missables left. Fully static and offline: no build step, no network request at run time, no Rockstar logo or artwork.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — or serve `app/` with any static file server and open `app/index.html`.

## How it is built

- `app/index.html` — the page: stats, roadmap, checklist, sources.
- `app/style.css` — the look: a dark Vice City dusk theme of its own, system fonts only.
- `app/app.js` — the tracker: filters, search, sort, spoiler mode, localStorage progress, export/import, and the per-trophy detail view.
- `app/data/trophies.json` — all 55 trophies with official names, descriptions, grades, hidden flags, kinds, counts, roadmap stages, and a cited guide each.
- `main.ts` — the entry program: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`.

## The trophy list, verified

55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze; 27 visible, 28 hidden. Names, descriptions and grades as reported 18 November 2026 from Exophase and cross-checked with PSNProfiles and TrueAchievements. Only one trophy is reported as possibly missable — Positive Mental Attitude, whose first meditation spot in Chapter 1 is said to vanish after that chapter (PowerPyx, GTABase). There are no online trophies at launch. Seven trophies have no confirmed unlock method published at launch; their guides say so plainly instead of inventing one. Sources per trophy: PowerPyx, PlanetGTA6, OutputLag, KeenGamer, GGRecon, GTA-Zone and EGamers — linked beside each guide in the app.

---

Entered on [make.fun](https://make.fun/?ref=fbrvfx55&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards
