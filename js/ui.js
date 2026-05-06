import { state, all } from './state.js';
import { db } from './supabase.js';
import { renderGrid } from './grid.js';
import { renderMap } from './map.js';
import { BADGE_LABELS } from './data.js';

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

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const { error } = await db.from('nurseries').insert({
    slug, name, city, state: 'OH',
    address:     document.getElementById('f-addr').value.trim()  || null,
    type,
    phone:       document.getElementById('f-phone').value.trim() || null,
    website:     document.getElementById('f-web').value.trim()   || null,
    description: document.getElementById('f-desc').value.trim()  || null,
    specialties: [],
    status: 'pending',
  });

  if (error) { showToast('Something went wrong. Please try again.', true); return; }

  document.getElementById('overlay').classList.remove('open');
  ['f-name','f-city','f-addr','f-phone','f-web','f-desc'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('f-type').value = '';
  showToast('Thanks! Your listing will appear after review.');
}

export async function submitFeedPost(nurseryId) {
  const typeEl = document.getElementById('pu-type');
  const textEl = document.getElementById('pu-text');
  const type   = typeEl?.value || 'tip';
  const text   = textEl?.value.trim() || '';
  if (!text) { showToast('Please write your update.', true); return; }

  const { error } = await db.from('feed_posts').insert({
    nursery_id:  nurseryId,
    type,
    badge:       BADGE_LABELS[type] || type,
    text,
    source:      'Community tip',
    source_type: 'community',
    status:      'pending',
  });

  if (error) { showToast('Something went wrong. Please try again.', true); return; }

  if (textEl) textEl.value = '';
  document.querySelector('.post-form')?.classList.remove('open');
  showToast('Thanks! Your update will appear after review.');
}

export function sharePage(title) {
  const url = location.href;
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url)
      .then(() => showToast('Link copied to clipboard!'))
      .catch(() => showToast('Copy: ' + url));
  }
}

export function showToast(msg, isError) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.style.background = isError ? '#b83030' : 'var(--moss)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}
