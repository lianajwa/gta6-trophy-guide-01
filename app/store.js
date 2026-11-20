// Vice Platinum — progress store.
// Saves the checklist in localStorage, and exports / imports it as a file.
// Nothing leaves the browser except a file the player chooses to save.

export const STORAGE_KEY = 'vice-platinum-progress-v1';

// Demo seed used by ?demo=1 (and by the screenshot helper): 13 earned trophies
// across story, activities, side content and money, with spoilers off.
export const DEMO_EARNED = [2, 3, 8, 15, 16, 20, 21, 33, 35, 42, 46, 52, 53];

export function blankState() {
  return { earned: new Set(), notes: {}, spoiler: true };
}

export function loadState() {
  const state = blankState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return state;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.earned)) {
      for (const id of parsed.earned) {
        if (Number.isInteger(id)) state.earned.add(id);
      }
    }
    if (parsed.notes && typeof parsed.notes === 'object') {
      for (const [key, value] of Object.entries(parsed.notes)) {
        if (typeof value === 'string') state.notes[key] = value;
      }
    }
    if (typeof parsed.spoiler === 'boolean') state.spoiler = parsed.spoiler;
  } catch (error) {
    // A corrupt save must never break the guide: start fresh.
    console.warn('Could not read saved progress; starting fresh.', error);
  }
  return state;
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      earned: [...state.earned].sort((a, b) => a - b),
      notes: state.notes,
      spoiler: state.spoiler,
      savedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.warn('Could not save progress.', error);
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Could not clear saved progress.', error);
  }
}

export function stateToFile(state) {
  return JSON.stringify({
    app: 'Vice Platinum — GTA 6 Trophy Guide & Tracker',
    exportedAt: new Date().toISOString(),
    earned: [...state.earned].sort((a, b) => a - b),
    notes: state.notes,
    spoiler: state.spoiler,
  }, null, 2);
}

export function downloadFile(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function stateFromFileText(text) {
  const parsed = JSON.parse(text);
  const next = blankState();
  const earned = parsed.earned ?? parsed.trophies ?? parsed.completed;
  if (!Array.isArray(earned)) throw new Error('That file has no earned-trophy list.');
  for (const id of earned) {
    const num = typeof id === 'number' ? id : Number.parseInt(String(id), 10);
    if (Number.isInteger(num) && num >= 1 && num <= 55) next.earned.add(num);
  }
  if (parsed.notes && typeof parsed.notes === 'object') {
    for (const [key, value] of Object.entries(parsed.notes)) {
      if (typeof value === 'string') next.notes[key] = value;
    }
  }
  if (typeof parsed.spoiler === 'boolean') next.spoiler = parsed.spoiler;
  return next;
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsText(file);
  });
}
