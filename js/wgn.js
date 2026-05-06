import { getWGNSeed, all } from './state.js';
import { BADGE_CLASS, SOURCE_ICON } from './data.js';

export function renderWGN() {
  const feed = document.getElementById('wgn-feed');
  if (!feed) return;
  const items = getWGNSeed();
  feed.innerHTML = items.map(p => `
    <div class="wgn-card" onclick="openWGN('${p.nursery}')">
      <div class="wgn-card-top">
        <span class="wgn-badge ${BADGE_CLASS[p.type] || 'badge-tip'}">${p.badge}</span>
        <span class="wgn-time">${p.time}</span>
      </div>
      <div class="wgn-nursery">${p.nursery}</div>
      <div class="wgn-text">${p.text}</div>
      <div class="wgn-source">${SOURCE_ICON[p.sourceType] || '👤'} ${p.source}</div>
    </div>`).join('');
}

export function openWGN(name) {
  const n = all().find(x => x.name.startsWith(name.replace(' GC', '')));
  if (n) window.navigate('/nursery/' + n.slug);
}
