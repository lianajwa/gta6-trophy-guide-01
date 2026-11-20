// Vice Platinum — entry point.
// Loads app/data/trophies.json, renders the checklist, and wires the tracker:
// saved progress, filters, search, spoiler mode, export / import, and the
// roadmap, missables, source matrix and audit views.

import {
  DEMO_EARNED,
  blankState,
  clearState,
  downloadFile,
  loadState,
  readFileAsText,
  saveState,
  stateFromFileText,
  stateToFile,
} from './store.js';
import {
  GRADE_LABELS,
  KIND_LABELS,
  buildModalBody,
  escapeHtml,
  renderAudit,
  renderMissableDetail,
  renderRoadmap,
  renderSourceMatrix,
  trophyCountLabel,
} from './views.js';

const DATA_URL = 'data/trophies.json';

let trophies = [];
let state = loadState();
let activeKind = 'all';
let activeGrade = 'all';
let searchText = '';
let earnedOnly = false;
let remainingOnly = false;

const listEl = document.getElementById('trophyList');
const resultCountEl = document.getElementById('resultCount');
const emptyNoteEl = document.getElementById('emptyNote');
const onlineNoteEl = document.getElementById('onlineNote');
const spoilerToggle = document.getElementById('spoilerToggle');
const earnedOnlyToggle = document.getElementById('earnedOnlyToggle');
const remainingToggle = document.getElementById('remainingToggle');

function trophyMatches(trophy) {
  if (activeKind === 'missable' && !trophy.missable) return false;
  if (activeKind === 'online') return false;
  if (activeKind !== 'all' && activeKind !== 'missable' && activeKind !== 'online' && trophy.kind !== activeKind) return false;
  if (activeGrade !== 'all' && trophy.grade !== activeGrade) return false;
  if (earnedOnly && !state.earned.has(trophy.id)) return false;
  if (remainingOnly && state.earned.has(trophy.id)) return false;
  if (searchText) {
    const haystack = `${trophy.name} ${trophy.description} ${KIND_LABELS[trophy.kind] || ''} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(searchText)) return false;
  }
  return true;
}

function spoilerHides(trophy) {
  return state.spoiler && trophy.kind === 'story' && !state.earned.has(trophy.id);
}

function renderChecklist() {
  const visible = trophies.filter(trophyMatches);
  listEl.innerHTML = '';
  for (const trophy of visible) {
    const earned = state.earned.has(trophy.id);
    const hiddenBySpoiler = spoilerHides(trophy);
    const row = document.createElement('li');
    row.className = `trophy-row${earned ? ' earned' : ''}${hiddenBySpoiler ? ' spoiler-hidden' : ''}`;
    const countLabel = trophyCountLabel(trophy);
    row.innerHTML = `
      <input type="checkbox" ${earned ? 'checked' : ''} aria-label="Mark ${escapeHtml(trophy.name)} as earned">
      <div>
        <div class="trophy-name">${hiddenBySpoiler ? 'Hidden story trophy — earn it to reveal' : escapeHtml(trophy.name)}</div>
        <div class="trophy-desc">${hiddenBySpoiler ? 'Story trophy. Its name and description are hidden until you earn it.' : escapeHtml(trophy.description)}</div>
        <div class="trophy-meta">
          <span class="tag grade-${trophy.grade}">${escapeHtml(GRADE_LABELS[trophy.grade])}</span>
          ${trophy.kind !== 'platinum' ? `<span class="tag">${escapeHtml(KIND_LABELS[trophy.kind] || trophy.kind)}</span>` : ''}
          ${trophy.hidden ? '<span class="tag hidden-tag">Hidden on PSN</span>' : ''}
          ${trophy.missable ? '<span class="tag missable-tag">⚠ Missable</span>' : ''}
          ${countLabel ? `<span class="tag count-tag">${escapeHtml(countLabel)}</span>` : ''}
          ${state.notes[trophy.id] ? '<span class="tag">📝 Note saved</span>' : ''}
        </div>
      </div>
      <div class="trophy-actions"><button type="button" class="guide-btn">Guide →</button></div>`;
    row.querySelector('input[type="checkbox"]').addEventListener('change', (event) => {
      setEarned(trophy.id, event.target.checked);
    });
    row.querySelector('.guide-btn').addEventListener('click', () => openModal(trophy.id));
    listEl.appendChild(row);
  }
  resultCountEl.textContent = `Showing ${visible.length} of ${trophies.length} trophies · ${state.earned.size} earned`;
  emptyNoteEl.hidden = visible.length !== 0;
  onlineNoteEl.hidden = activeKind !== 'online';
}

function renderStats() {
  const total = trophies.length;
  const earned = state.earned.size;
  const pct = total ? Math.round((earned / total) * 100) : 0;
  document.getElementById('earnedCount').textContent = earned;
  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('progressPct').textContent = `${pct}% to the platinum — ${total - earned} to go`;
  const gradeStats = document.getElementById('gradeStats');
  gradeStats.innerHTML = '';
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const inGrade = trophies.filter((trophy) => trophy.grade === grade);
    const done = inGrade.filter((trophy) => state.earned.has(trophy.id)).length;
    const span = document.createElement('span');
    span.innerHTML = `<i class="medal ${grade}"></i><strong>${done}/${inGrade.length}</strong> ${GRADE_LABELS[grade]}`;
    gradeStats.appendChild(span);
  }
  const next = trophies.find((trophy) => !state.earned.has(trophy.id) && trophy.kind === 'story')
    || trophies.find((trophy) => !state.earned.has(trophy.id));
  const nextEl = document.getElementById('nextUp');
  if (!next) {
    nextEl.textContent = 'Every trophy earned. The platinum is yours — Leonida Legend.';
  } else if (spoilerHides(next)) {
    nextEl.innerHTML = 'Next up: <b>a hidden story trophy</b> — spoiler mode is on; earn story trophies to reveal their names.';
  } else {
    nextEl.innerHTML = `Next up: <b>${escapeHtml(next.name)}</b> — ${escapeHtml(next.description)}`;
  }
}

function renderAll() {
  renderChecklist();
  renderStats();
  renderRoadmap(document.getElementById('roadmapStages'), trophies, state.earned, openModal);
  renderMissableDetail(document.getElementById('missableDetail'), trophies);
  renderSourceMatrix(document.getElementById('sourceMatrix'));
  renderAudit(document.getElementById('auditDetail'), trophies);
}

function setEarned(id, value) {
  if (value) state.earned.add(id);
  else state.earned.delete(id);
  saveState(state);
  renderChecklist();
  renderStats();
  renderRoadmap(document.getElementById('roadmapStages'), trophies, state.earned, openModal);
}

function setNote(id, text) {
  if (text.trim()) state.notes[id] = text;
  else delete state.notes[id];
  saveState(state);
}

function openModal(id) {
  const trophy = trophies.find((item) => item.id === id);
  if (!trophy) return;
  const backdrop = document.getElementById('modalBackdrop');
  const body = document.getElementById('modalBody');
  body.innerHTML = '';
  body.appendChild(buildModalBody(trophy, state, {
    onToggleEarned: (trophyId, value) => setEarned(trophyId, value),
    onNote: (trophyId, text) => setNote(trophyId, text),
  }));
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalBackdrop').hidden = true;
  document.body.style.overflow = '';
  renderChecklist();
}

function showView(name) {
  for (const button of document.querySelectorAll('.tab')) {
    button.classList.toggle('active', button.dataset.view === name);
  }
  for (const section of document.querySelectorAll('.view')) {
    section.classList.toggle('active', section.id === `view-${name}`);
  }
  if (window.location.hash !== `#${name}`) {
    window.history.replaceState(null, '', `#${name}`);
  }
}

function wireEvents() {
  document.getElementById('searchInput').addEventListener('input', (event) => {
    searchText = event.target.value.trim().toLowerCase();
    renderChecklist();
  });
  document.getElementById('kindFilters').addEventListener('click', (event) => {
    const chip = event.target.closest('[data-kind]');
    if (!chip) return;
    activeKind = chip.dataset.kind;
    for (const button of document.querySelectorAll('#kindFilters .chip')) {
      button.classList.toggle('active', button === chip);
    }
    renderChecklist();
  });
  document.getElementById('gradeFilter').addEventListener('change', (event) => {
    activeGrade = event.target.value;
    renderChecklist();
  });
  spoilerToggle.addEventListener('change', () => {
    state.spoiler = spoilerToggle.checked;
    saveState(state);
    renderChecklist();
  });
  earnedOnlyToggle.addEventListener('change', () => {
    earnedOnly = earnedOnlyToggle.checked;
    if (earnedOnly) { remainingOnly = false; remainingToggle.checked = false; }
    renderChecklist();
  });
  remainingToggle.addEventListener('change', () => {
    remainingOnly = remainingToggle.checked;
    if (remainingOnly) { earnedOnly = false; earnedOnlyToggle.checked = false; }
    renderChecklist();
  });
  document.getElementById('exportBtn').addEventListener('click', () => {
    downloadFile('vice-platinum-progress.json', stateToFile(state));
  });
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      state = stateFromFileText(text);
      spoilerToggle.checked = state.spoiler;
      saveState(state);
      renderAll();
      alert(`Imported ${state.earned.size} earned trophies.`);
    } catch (error) {
      alert(`Could not import that file: ${error.message}`);
    }
    event.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!window.confirm('Reset all progress and notes? This cannot be undone.')) return;
    clearState();
    state = blankState();
    spoilerToggle.checked = state.spoiler;
    saveState(state);
    renderAll();
  });
  for (const button of document.querySelectorAll('.tab')) {
    button.addEventListener('click', () => showView(button.dataset.view));
  }
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', () => showView(link.dataset.nav));
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', (event) => {
    if (event.target.id === 'modalBackdrop') closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
  window.addEventListener('hashchange', () => {
    const name = window.location.hash.slice(1);
    if (['checklist', 'roadmap', 'missables', 'sources', 'audit'].includes(name)) showView(name);
  });
}

async function boot() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('demo')) {
    // Screenshot / demo mode: seed 13 earned trophies, spoilers off.
    state = blankState();
    for (const id of DEMO_EARNED) state.earned.add(id);
    state.spoiler = false;
    saveState(state);
  }
  if (params.has('spoiler')) state.spoiler = params.get('spoiler') === '1';
  spoilerToggle.checked = state.spoiler;
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Could not load ${DATA_URL}`);
  const data = await response.json();
  trophies = data.trophies;
  wireEvents();
  const view = window.location.hash.slice(1);
  if (['roadmap', 'missables', 'sources', 'audit'].includes(view)) showView(view);
  renderAll();
  const trophyParam = Number.parseInt(params.get('trophy') || '', 10);
  if (Number.isInteger(trophyParam)) openModal(trophyParam);
}

boot().catch((error) => {
  listEl.innerHTML = `<li class="trophy-row"><div><div class="trophy-name">The guide could not load its trophy data.</div><div class="trophy-desc">${escapeHtml(error.message)} — serve app/ with a static server (node serve.ts) and reload.</div></div></li>`;
});
