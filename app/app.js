// Leonida Trophy Atlas: checklist + tracker for the 55 GTA VI trophies.
// Loads only its own data file (data/trophies.json) and stores progress in localStorage.
// No network request is made at run time.
const KEY = 'gta6-trophy-atlas-v1';
const SPOILER_KEY = 'gta6-trophy-atlas-spoiler';
const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
const KIND_LABEL = {
  story: 'Story', missable: 'Missable', collectibles: 'Collectibles',
  activities: 'Activities', online: 'Online', platinum: 'Platinum', completion: '100% completion',
};

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]').filter((n) => trophies.some((t) => t.name === n)));
let kind = 'all';
let grade = 'all';
let query = '';
let sort = 'roadmap';
let spoiler = localStorage.getItem(SPOILER_KEY) === '1';

const $ = (id) => document.getElementById(id);
const listEl = $('list');
const stagesEl = $('stages');

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
  localStorage.setItem(SPOILER_KEY, spoiler ? '1' : '0');
}

function isSpoiled(t) {
  return spoiler && t.kind === 'story' && !earned.has(t.name);
}

function gradeTag(t) {
  return `<span class="tag ${t.grade}">${t.grade[0].toUpperCase()}${t.grade.slice(1)}</span>`;
}

function metaTags(t) {
  const tags = [gradeTag(t), `<span class="tag">${KIND_LABEL[t.kind] ?? t.kind}</span>`];
  if (t.hidden) tags.push('<span class="tag hidden">Hidden on PlayStation</span>');
  if (t.missable) tags.push('<span class="tag missable">Missable</span>');
  if (t.unconfirmed) tags.push('<span class="tag unconfirmed">Method unconfirmed at launch</span>');
  if (t.count) tags.push(`<span class="tag">Target: ${t.count}</span>`);
  tags.push(`<span class="tag">Roadmap stage ${t.stage}</span>`);
  return tags.join('');
}

function sourceLinks(t) {
  return t.sources.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`).join('');
}

function cardHtml(t) {
  const done = earned.has(t.name);
  const spoiled = isSpoiled(t);
  const name = spoiled ? 'Hidden story trophy' : t.name;
  const desc = spoiled
    ? 'Hidden until earned — spoiler mode is on. Earn it, or turn spoiler mode off, to reveal it.'
    : t.description;
  const guide = spoiled
    ? '<p class="guide spoiled">Guide hidden with the spoiler. It names the mission and how to finish it.</p>'
    : `<p class="guide"><strong>How to get it:</strong> ${t.guide}</p>`;
  const miss = t.missable && !spoiled
    ? `<p class="miss-note">Missable: ${t.missableNote ?? 'do this before moving on.'}</p>` : '';
  const srcs = spoiled ? '' : `<p class="srcs">Sources: ${sourceLinks(t)}</p>`;
  return `<article class="card${done ? ' earned' : ''}" data-id="${t.id}">
    <input type="checkbox" data-name="${t.name}" ${done ? 'checked' : ''} aria-label="Mark ${name} earned">
    <div>
      <h3><button type="button" data-open="${t.id}">${name}</button></h3>
      <p class="desc">${desc}</p>
      <p class="meta">${metaTags(t)}</p>
      ${miss}${guide}${srcs}
    </div>
  </article>`;
}

function visibleTrophies() {
  const q = query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kind === 'missable' && !t.missable) return false;
    if (kind === 'online') return false;
    if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (q && ![t.name, t.description, t.guide, t.kind].join(' ').toLowerCase().includes(q)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'grade') return GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || a.id - b.id;
    return a.stage - b.stage || a.id - b.id;
  });
}

function renderStats() {
  const total = trophies.length;
  const n = earned.size;
  const pct = Math.round((n / total) * 100);
  $('statPct').textContent = `${pct}%`;
  $('statEarned').textContent = `${n} / ${total}`;
  const byGrade = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => trophies.filter((t) => t.grade === g && earned.has(t.name)).length);
  $('statGrades').textContent = byGrade.join(' · ');
  const missLeft = trophies.filter((t) => t.missable && !earned.has(t.name)).length;
  $('statMissable').textContent = missLeft === 0 ? 'none left' : `${missLeft} left`;
  $('barFill').style.width = `${pct}%`;
  const next = [...trophies].sort((a, b) => a.stage - b.stage || a.id - b.id)
    .find((t) => t.grade !== 'platinum' && !earned.has(t.name));
  $('nextUp').innerHTML = next
    ? `Next up: <strong>${next.name}</strong> — ${next.description} (stage ${next.stage})`
    : 'Every trophy is earned — the platinum is yours.';
}

function renderRoadmap() {
  stagesEl.replaceChildren();
  for (const s of doc.roadmap) {
    const stageTrophies = trophies.filter((t) => t.stage === s.stage);
    const chips = stageTrophies.map((t) => {
      const done = earned.has(t.name);
      const label = isSpoiled(t) ? `Hidden story trophy` : t.name;
      return `<button type="button" class="chip${done ? ' done' : ''}" data-open="${t.id}">${done ? '✓ ' : ''}${label}</button>`;
    }).join('');
    const div = document.createElement('div');
    div.className = 'stage';
    div.innerHTML = `<h3><span class="step">Stage ${s.stage}</span>${s.title}</h3>
      <p class="time">${s.time}</p><p>${s.text}</p><div class="chiprow">${chips}</div>`;
    stagesEl.append(div);
  }
}

function renderList() {
  const shown = visibleTrophies();
  listEl.innerHTML = shown.map(cardHtml).join('');
  $('shown').textContent = `${shown.length} of ${trophies.length} shown`;
  $('empty').hidden = shown.length > 0;
  $('onlineNote').hidden = kind !== 'online';
}

function renderAll() {
  renderStats();
  renderRoadmap();
  renderList();
}

function openModal(id) {
  const t = byId.get(Number(id));
  if (!t) return;
  const done = earned.has(t.name);
  const spoiled = isSpoiled(t);
  const stage = doc.roadmap[t.stage - 1];
  $('modalBody').innerHTML = `
    <p class="meta">${metaTags(t)}</p>
    <h2 id="modalName">${spoiled ? 'Hidden story trophy' : t.name}</h2>
    <p class="desc">${spoiled ? 'Hidden until earned — spoiler mode is on.' : t.description}</p>
    <dl class="detail-grid">
      <dt>Grade</dt><dd>${t.grade[0].toUpperCase()}${t.grade.slice(1)}</dd>
      <dt>Kind</dt><dd>${KIND_LABEL[t.kind] ?? t.kind}</dd>
      <dt>Hidden on PlayStation</dt><dd>${t.hidden ? 'Yes — hidden until earned' : 'No — visible from the start'}</dd>
      <dt>Missable</dt><dd>${t.missable ? 'Yes — see the warning below' : 'No'}</dd>
      ${t.count ? `<dt>Target</dt><dd>${t.count}</dd>` : ''}
      <dt>Roadmap</dt><dd>Stage ${t.stage} — ${stage.title}</dd>
      <dt>Status</dt><dd>${done ? 'Earned' : 'Not earned yet'}</dd>
    </dl>
    ${t.missable && !spoiled ? `<p class="miss-note">Missable: ${t.missableNote ?? ''}</p>` : ''}
    ${spoiled
      ? '<p class="guide spoiled">Guide hidden with the spoiler.</p>'
      : `<p class="guide"><strong>How to get it:</strong> ${t.guide}</p>
         <p class="srcs">Sources: ${sourceLinks(t)}</p>`}
    <p><button type="button" id="modalToggle">${done ? 'Mark as not earned' : 'Mark as earned'}</button></p>`;
  $('modal').hidden = false;
  $('modalToggle').addEventListener('click', () => {
    toggleEarned(t.name);
    openModal(t.id);
  });
}

function closeModal() {
  $('modal').hidden = true;
}

function toggleEarned(name) {
  if (earned.has(name)) earned.delete(name);
  else earned.add(name);
  save();
  renderAll();
}

function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 2600);
}

function exportProgress() {
  const payload = {
    app: 'Leonida Trophy Atlas — GTA VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
  toast(`Exported ${earned.size} earned trophies.`);
}

async function importProgress(file) {
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('bad file');
    const known = new Set(trophies.map((t) => t.name));
    const good = names.filter((n) => known.has(n));
    earned = new Set(good);
    save();
    renderAll();
    toast(`Imported ${good.length} earned trophies${names.length - good.length ? ` (${names.length - good.length} unknown names skipped)` : ''}.`);
  } catch {
    toast('That file is not a trophy progress export.');
  }
}

// Events: one delegated listener covers the checklist, the roadmap chips and the modal buttons.
document.addEventListener('click', (e) => {
  const open = e.target.closest('[data-open]');
  if (open) { openModal(open.dataset.open); return; }
  if (e.target.closest('#modalClose') || e.target.id === 'modal') closeModal();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
listEl.addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')) toggleEarned(e.target.dataset.name);
});
$('kindChips').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-kind]');
  if (!btn) return;
  kind = btn.dataset.kind;
  document.querySelectorAll('#kindChips button').forEach((b) => b.classList.toggle('on', b === btn));
  renderList();
});
$('grade').addEventListener('change', (e) => { grade = e.target.value; renderList(); });
$('sort').addEventListener('change', (e) => { sort = e.target.value; renderList(); });
$('search').addEventListener('input', (e) => { query = e.target.value; renderList(); });
$('spoiler').addEventListener('change', (e) => {
  spoiler = e.target.checked;
  save();
  renderAll();
});
$('export').addEventListener('click', exportProgress);
$('import').addEventListener('change', (e) => {
  if (e.target.files[0]) importProgress(e.target.files[0]);
  e.target.value = '';
});
$('reset').addEventListener('click', () => {
  if (earned.size === 0) { toast('Nothing to reset.'); return; }
  earned = new Set();
  save();
  renderAll();
  toast('Progress reset.');
});

// Deep links for sharing and for this guide's own screenshots: ?earned=1,2,3 marks
// those trophies earned, ?shot=guide&id=28 opens a trophy's detail, ?shot=roadmap
// scrolls to the roadmap, ?shot=spoiler turns spoiler mode on.
function applyShotParams() {
  const params = new URLSearchParams(location.search);
  const earnedParam = params.get('earned');
  if (earnedParam) {
    const ids = new Set(earnedParam.split(',').map((s) => Number(s.trim())));
    earned = new Set(trophies.filter((t) => ids.has(t.id)).map((t) => t.name));
    save();
  }
  const shot = params.get('shot');
  if (shot === 'spoiler' || params.get('spoiler') === '1') {
    spoiler = true;
    $('spoiler').checked = true;
  }
  renderAll();
  // Screenshot deep links use instant scrolling: with `scroll-behavior: smooth`
  // on html, a smooth scrollIntoView can still be animating when a headless
  // screenshot is taken, which captured the roadmap shot mid-scroll with an
  // unpainted white band at the top. Instant scrolling lands exactly.
  if (shot === 'cover') window.scrollTo({ top: 0, behavior: 'instant' });
  if (shot === 'guide' && params.get('id')) openModal(params.get('id'));
  if (shot === 'roadmap') $('roadmap').scrollIntoView({ behavior: 'instant', block: 'start' });
  if (shot === 'spoiler') $('tracker').scrollIntoView({ behavior: 'instant', block: 'start' });
}

$('spoiler').checked = spoiler;
applyShotParams();
