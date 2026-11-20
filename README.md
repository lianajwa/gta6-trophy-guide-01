# gta6-trophy-guide-01

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/lianajwa/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01/leaderboard)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/lianajwa/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01/leaderboard)

## Vice Platinum — GTA 6 Trophy Guide & Tracker

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze — 28 hidden, exactly 1 missable, 0 online), written for the make.fun bounty `gta6-trophy-guide-01`.

What it does:

- **Tracker** — a checklist of all 55 trophies with their official names, descriptions and grades, saved in the browser (localStorage), with export to a file and import back. Per-trophy notes, too.
- **Filters and search** — by kind (story, missable, collectibles, activities, side missions, one-offs, online), by grade, by earned / remaining, plus full-text search.
- **Spoiler mode** — hides the names and descriptions of story trophies until you earn them.
- **Stats bar** — earned / total, percentage to the platinum, per-grade counts, and a "next up" suggestion.
- **Platinum roadmap** — six stages in order, built from the official trophy descriptions: story first, side characters, activities, collectibles, robberies and one-offs, then 100% completion and the platinum.
- **Missables** — exactly one trophy is reported missable, Positive Mental Attitude, and it gets a full warning: the Chapter 1 balcony meditation disappears after Chapter 1. The guide explains why the other 54 are safe.
- **Cited guides** — every trophy has a guide in the author's own words, with its sources named and linked beside it (Exophase, PSNProfiles, PowerPyx, Insider Gaming, HowToVideoGame, CryptoGames, EGamers — all checked 20 Nov 2026). Where a trigger was not yet confirmed at launch, the guide says so instead of inventing a step.
- **Source matrix and audit** — every source used, dated, with what it covers; and an audit strip verifying the counts (55 total, grades, 28 hidden, 1 missable, 0 online).

The app is plain static files (vanilla HTML, CSS and JavaScript, no libraries, no build step) and works fully offline: it loads nothing from the network and sends nothing anywhere. No Rockstar logo, artwork or game screenshots — the look is original.

## Run it

```sh
node serve.ts
```

Then open <http://localhost:8080> in a desktop browser. `?demo=1` seeds 13 earned trophies for a quick look (spoilers off); add `&spoiler=1` to see spoiler mode with seeded progress, or `&trophy=28` to open a trophy's guide directly.

## Files

- `app/index.html` — the guide's shell: header, stats, filters, tabs, modal
- `app/style.css` — layout and structure
- `app/theme.css` — the Vice City sunset colour theme
- `app/app.js` — boot, checklist, filters, search, stats, export / import
- `app/store.js` — localStorage progress, export / import file handling
- `app/views.js` — roadmap, missables, source matrix, audit, detail modal
- `app/data/trophies.json` — the official 55-trophy list with a cited guide per trophy
- `screenshots/` — 4 real renders of the guide (checklist, trophy guide, roadmap, spoiler mode)
- `main.ts` — the entry program: copies `app/` and `screenshots/` to the output and writes `dossier.json`
- `serve.ts` — the local static server above

## Build the entry

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Then check `out/` holds `app/`, `screenshots/` and `dossier.json`, and delete `out/` before committing — it is a build artifact, not part of the entry.

Entered on [make.fun](https://make.fun/?ref=fbrvfx55&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
