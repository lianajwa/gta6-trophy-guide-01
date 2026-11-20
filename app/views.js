// Vice Platinum — views that are not the checklist: the roadmap, the missables
// page, the source matrix, the audit page and the per-trophy detail modal.
// Every source below was checked on 20 November 2026.

export const SOURCES = [
  {
    id: 'exophase',
    name: 'Exophase — Grand Theft Auto VI Trophies (PS5)',
    url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
    date: '20 Nov 2026',
    covers: 'Official trophy names, descriptions and grades for all 55 trophies.',
  },
  {
    id: 'psnprofiles',
    name: 'PSNProfiles — Grand Theft Auto VI trophies',
    url: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
    date: '18 Nov 2026',
    covers: 'Grades and the counts PlayStation tracks (42 shooting-range challenges, 250 stunts, 18 meditations, 52 areas…).',
  },
  {
    id: 'powerpyx-roadmap',
    name: 'PowerPyx — GTA 6 Trophy Guide & Roadmap',
    url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
    date: '19 Nov 2026',
    covers: 'Roadmap order, the one missable trophy, difficulty 4/10, ~200 hours to platinum; which triggers were not yet known at launch.',
  },
  {
    id: 'powerpyx-meditation',
    name: 'PowerPyx — All Meditation Spot Locations',
    url: 'https://www.powerpyx.com/gta-6-all-meditation-spot-locations/',
    date: '19 Nov 2026',
    covers: '18 meditations across 10 spots; the Chapter 1 balcony meditation is missable; 15 of 18 count for 100% completion.',
  },
  {
    id: 'insider-gaming',
    name: 'Insider Gaming — Complete GTA 6 Trophy List',
    url: 'https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/',
    date: '19 Nov 2026',
    covers: 'The 28 hidden trophies listed separately; confirms the hidden split and the story trophies.',
  },
  {
    id: 'howtovideogame',
    name: 'HowToVideoGame — GTA 6 Trophy and Achievement List',
    url: 'https://howtovideogame.com/gta-6-trophies/',
    date: '19 Nov 2026',
    covers: 'Confirms 28 hidden, 0 online trophies, and the PSN counts (42 gold medals, 14 drone-race locations, 9 activity types, 500 choices).',
  },
  {
    id: 'cryptogames',
    name: 'CryptoGames — GTA 6 Trophies and Achievements: Full List',
    url: 'https://cryptogames.gg/gta-6-trophies-achievements-full-list/',
    date: '19 Nov 2026',
    covers: 'Confirms the only possibly missable trophy (Positive Mental Attitude) and that A Long Road (100%) is the hardest trophy.',
  },
  {
    id: 'egamers',
    name: 'EGamers — GTA 6 Trophy List: All 55 Trophies',
    url: 'https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/',
    date: '19 Nov 2026',
    covers: 'Confirms the missable flag and that PowerPyx lists some triggers (Personal Best, Bad Luck, The Truth Is Out There) as not yet known.',
  },
];

export const STAGES = [
  {
    stage: 1,
    title: 'Play the story — and grab the Chapter 1 meditation',
    blurb: 'Chapters 1 to 5 and the final mission. Twelve trophies pop here just for finishing missions. The only thing you must do on purpose is the balcony meditation with Lucia at Jason’s house in Chapter 1 — it is the one missable step in the whole game.',
  },
  {
    stage: 2,
    title: 'Side characters and strangers',
    blurb: 'The five side-character chains (Andy, Kenton, Billy, Randy, Tyrone), Bret’s hunt and the 8 stranger strands. Take these missions when they appear on the map: some givers go temporarily unavailable during the story, and stranger chains have windows tied to story progress.',
  },
  {
    stage: 3,
    title: 'Activities and challenges',
    blurb: 'Stunts, the shooting range, drone races, races, fishing, the arcade, bowling and the 50 challenges. Nine trophies. The shooting range is the skill wall — 42 gold medals — while the rest climb by playing.',
  },
  {
    stage: 4,
    title: 'Collectibles and exploration',
    blurb: 'Meditations, card sets, WAiNK locations, vehicles, the 52 areas of Leonida, garages and Scooter Bros registrations. Seven trophies, all free-roam friendly. Finish the meditation chain here — the final spot only opens after the other nine.',
  },
  {
    stage: 5,
    title: 'Robberies, heists and one-offs',
    blurb: 'Bank vaults, armored trucks, gang operations, partner robberies and the hidden one-off stunt trophies. Eighteen trophies, and the money goals (launder $250,000, spend $100,000) finish themselves while you do them.',
  },
  {
    stage: 6,
    title: 'Cleanup and the platinum',
    blurb: 'The 100% completion checklist, then the platinum. A Long Road is the last trophy for almost every player — when it pops, Vice Got a Price! pops with it.',
  },
];

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export const KIND_LABELS = {
  platinum: 'Platinum',
  completion: '100% completion',
  story: 'Story',
  side: 'Side missions',
  collectible: 'Collectible',
  activity: 'Activity',
  misc: 'One-off',
};

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function sourceById(id) {
  return SOURCES.find((source) => source.id === id);
}

export function trophyCountLabel(trophy) {
  if (trophy.count === null || trophy.count === undefined) return null;
  if (trophy.id === 48) return 'PSN counts to 500';
  if (trophy.id === 52) return 'Target: $250,000';
  if (trophy.id === 53) return 'Target: $100,000';
  if (trophy.id === 14) return 'Target: 100%';
  return `Target: ${trophy.count}`;
}

export function renderRoadmap(container, trophies, earned, onOpen) {
  container.innerHTML = '';
  for (const stage of STAGES) {
    const members = trophies.filter((trophy) => trophy.stage === stage.stage);
    const done = members.filter((trophy) => earned.has(trophy.id)).length;
    const block = document.createElement('article');
    block.className = 'stage';
    block.innerHTML = `
      <div class="stage-head">
        <span class="stage-num">Stage ${stage.stage}</span>
        <h3>${escapeHtml(stage.title)}</h3>
        <span class="stage-count">${done} / ${members.length} earned</span>
      </div>
      <p>${escapeHtml(stage.blurb)}</p>
      <div class="stage-trophies"></div>`;
    const list = block.querySelector('.stage-trophies');
    for (const trophy of members) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = earned.has(trophy.id) ? 'done' : '';
      button.innerHTML = `${escapeHtml(trophy.name)} <span class="mini-grade">· ${GRADE_LABELS[trophy.grade]}</span>`;
      button.addEventListener('click', () => onOpen(trophy.id));
      list.appendChild(button);
    }
    container.appendChild(block);
  }
}

export function renderMissableDetail(container, trophies) {
  const trophy = trophies.find((item) => item.id === 28);
  container.innerHTML = '';
  if (!trophy) return;
  const card = document.createElement('div');
  card.className = 'missable-card';
  card.innerHTML = `
    <h3>⚠ ${escapeHtml(trophy.name)} — ${escapeHtml(GRADE_LABELS[trophy.grade])}</h3>
    <p><em>“${escapeHtml(trophy.description)}”</em></p>
    <p>${escapeHtml(trophy.guide)}</p>
    <h4>Sources for this warning</h4>
    <ul class="source-links">
      ${trophy.sources.map((id) => {
        const source = sourceById(id);
        return source
          ? `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.name)} — ${escapeHtml(source.date)}</a></li>`
          : '';
      }).join('')}
    </ul>`;
  container.appendChild(card);
}

export function renderSourceMatrix(container) {
  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'table-wrap';
  wrap.innerHTML = `
    <table class="source-table">
      <thead><tr><th>Source</th><th>Checked</th><th>What it covers in this guide</th></tr></thead>
      <tbody>
        ${SOURCES.map((source) => `
          <tr>
            <td><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.name)}</a></td>
            <td>${escapeHtml(source.date)}</td>
            <td>${escapeHtml(source.covers)}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
  container.appendChild(wrap);
}

export function renderAudit(container, trophies) {
  const byGrade = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) byGrade[trophy.grade] += 1;
  const hidden = trophies.filter((trophy) => trophy.hidden).length;
  const missable = trophies.filter((trophy) => trophy.missable).length;
  container.innerHTML = `
    <div class="audit-grid">
      <div class="audit-cell"><div class="big">${trophies.length}</div><div class="lbl">total trophies</div></div>
      <div class="audit-cell"><div class="big">${byGrade.platinum}</div><div class="lbl">platinum</div></div>
      <div class="audit-cell"><div class="big">${byGrade.gold}</div><div class="lbl">gold</div></div>
      <div class="audit-cell"><div class="big">${byGrade.silver}</div><div class="lbl">silver</div></div>
      <div class="audit-cell"><div class="big">${byGrade.bronze}</div><div class="lbl">bronze</div></div>
      <div class="audit-cell"><div class="big">${hidden}</div><div class="lbl">hidden until earned</div></div>
      <div class="audit-cell"><div class="big">${missable}</div><div class="lbl">missable</div></div>
      <div class="audit-cell"><div class="big">0</div><div class="lbl">online trophies</div></div>
    </div>`;
}

export function buildModalBody(trophy, state, callbacks) {
  const stage = STAGES.find((item) => item.stage === trophy.stage);
  const countLabel = trophyCountLabel(trophy);
  const earned = state.earned.has(trophy.id);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <h2 id="modalTitle">${escapeHtml(trophy.name)}</h2>
    <div class="trophy-meta">
      <span class="tag grade-${trophy.grade}">${escapeHtml(GRADE_LABELS[trophy.grade])}</span>
      ${trophy.kind !== 'platinum' ? `<span class="tag">${escapeHtml(KIND_LABELS[trophy.kind] || trophy.kind)}</span>` : ''}
      ${trophy.hidden ? '<span class="tag hidden-tag">Hidden on PSN</span>' : ''}
      ${trophy.missable ? '<span class="tag missable-tag">⚠ Missable</span>' : ''}
      ${countLabel ? `<span class="tag count-tag">${escapeHtml(countLabel)}</span>` : ''}
      <span class="tag">Roadmap stage ${trophy.stage}${stage ? ` — ${escapeHtml(stage.title)}` : ''}</span>
    </div>
    <p class="official">Official description: “${escapeHtml(trophy.description)}”</p>
    <h4>Guide — in our own words</h4>
    <div class="guide-text"><p>${escapeHtml(trophy.guide)}</p></div>
    <h4>Sources for this trophy</h4>
    <ul class="source-links">
      ${trophy.sources.map((id) => {
        const source = sourceById(id);
        return source
          ? `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.name)} — ${escapeHtml(source.date)}</a></li>`
          : '';
      }).join('')}
    </ul>
    <label class="earned-line"><input type="checkbox" id="modalEarned" ${earned ? 'checked' : ''}> <span>Mark as earned</span></label>
    <div class="note-box">
      <h4>Your note</h4>
      <textarea id="modalNote" placeholder="Where was it? What worked? (saved in this browser only)">${escapeHtml(state.notes[trophy.id] || '')}</textarea>
    </div>`;
  wrapper.querySelector('#modalEarned').addEventListener('change', (event) => {
    callbacks.onToggleEarned(trophy.id, event.target.checked);
  });
  wrapper.querySelector('#modalNote').addEventListener('input', (event) => {
    callbacks.onNote(trophy.id, event.target.value);
  });
  return wrapper;
}
