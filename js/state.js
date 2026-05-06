// Single mutable state object — all modules import and mutate this reference
export const state = {
  userEntries:    [],
  activeFilter:   'all',
  searchTerm:     '',
  currentView:    'grid',
  mapInstance:    null,
  markers:        [],
  activeMarkerId: null,
};

export const STORAGE_KEY = 'lg-dayton-v1';

let SEED     = [];
let WGN_SEED = [];

export function setSeedData(nurseries, feed) {
  SEED     = nurseries;
  WGN_SEED = feed;
}

export function getWGNSeed() { return WGN_SEED; }

export async function load() {
  try {
    const r = await window.storage?.get(STORAGE_KEY);
    if (r?.value) state.userEntries = JSON.parse(r.value);
  } catch {}
}

export async function save() {
  try {
    await window.storage?.set(STORAGE_KEY, JSON.stringify(state.userEntries));
  } catch {}
}

export function all() { return [...SEED, ...state.userEntries]; }

export function filtered() {
  return all().filter(n => {
    const q  = state.searchTerm.toLowerCase();
    const ms = !q ||
      n.name.toLowerCase().includes(q) ||
      n.city.toLowerCase().includes(q) ||
      (n.desc || '').toLowerCase().includes(q) ||
      n.type.toLowerCase().includes(q) ||
      (n.specialties || []).join(' ').toLowerCase().includes(q);
    const mf = state.activeFilter === 'all' || n.type === state.activeFilter;
    return ms && mf;
  });
}
