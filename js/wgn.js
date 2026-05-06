import { getWGNSeed } from './state.js';
import { BADGE_CLASS, SOURCE_ICON, timeAgo } from './data.js';

export function renderWGN() {
  const feed = document.getElementById('wgn-feed');
  if (!feed) return;
  const items = getWGNSeed();
  if (!items.length) {
    feed.innerHTML = '<p style="font-size:.84rem;color:var(--text3);padding:8px 0">No community updates yet.</p>';
    return;
  }
  feed.innerHTML = items.map(p => {
    const slug = p.nurseries?.slug || '';
    const name = p.nurseries?.name || '';
    return `
    <div class="wgn-card" onclick="openWGN('${slug}')">
      <div class="wgn-card-top">
        <span class="wgn-badge ${BADGE_CLASS[p.type] || 'badge-tip'}">${p.badge}</span>
        <span class="wgn-time">${timeAgo(p.created_at)}</span>
      </div>
      <div class="wgn-nursery">${name}</div>
      <div class="wgn-text">${p.text}</div>
      <div class="wgn-source">${SOURCE_ICON[p.source_type] || '👤'} ${p.source}</div>
    </div>`;
  }).join('');
}

export function openWGN(slug) {
  if (slug) window.navigate('/nursery/' + slug);
}
