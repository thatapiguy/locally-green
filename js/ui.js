import { state, all, save } from './state.js';
import { renderGrid } from './grid.js';
import { renderMap } from './map.js';

export function switchView(v) {
  state.currentView = v;
  document.getElementById('grid-view').classList.toggle('hidden', v !== 'grid');
  document.getElementById('map-view').classList.toggle('hidden', v !== 'map');
  document.getElementById('btn-grid').classList.toggle('active', v === 'grid');
  document.getElementById('btn-map').classList.toggle('active', v === 'map');
  if (v === 'grid') renderGrid(); else renderMap();
}

export async function submitListing() {
  const name = document.getElementById('f-name').value.trim();
  const city = document.getElementById('f-city').value.trim();
  const type = document.getElementById('f-type').value;
  if (!name || !city || !type) { showToast('Please fill in Name, City, and Type.', true); return; }
  const slug  = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const entry = {
    id:       'u' + Date.now(),
    slug, name, city,
    address:  document.getElementById('f-addr').value.trim()  || city + ', OH',
    type,
    phone:    document.getElementById('f-phone').value.trim(),
    website:  document.getElementById('f-web').value.trim(),
    desc:     document.getElementById('f-desc').value.trim()  || 'Community-submitted location.',
    specialties: [],
    hours:    { Mon: '–', Tue: '–', Wed: '–', Thu: '–', Fri: '–', Sat: '–', Sun: '–' },
    lat:      39.758  + (Math.random() - .5) * .09,
    lng:      -84.192 + (Math.random() - .5) * .13,
    userAdded: true,
  };
  state.userEntries.push(entry);
  await save();
  document.getElementById('overlay').classList.remove('open');
  ['f-name', 'f-city', 'f-addr', 'f-phone', 'f-web', 'f-desc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-type').value = '';
  if (state.currentView === 'grid') renderGrid(); else renderMap();
  showToast('🌿 Location added — thank you!');
  document.getElementById('stat-total').textContent = all().length;
}

export function showToast(msg, isError) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.style.background = isError ? '#b83030' : 'var(--moss)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}
