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

export function renderFeedPage() {
  const el = document.getElementById('feed-page-content');
  if (!el) return;
  const items = getWGNSeed();

  const listHTML = items.length
    ? items.map(p => {
        const slug = p.nurseries?.slug || '';
        const name = p.nurseries?.name || 'Unknown nursery';
        return `
        <div class="feed-full-item" onclick="openWGN('${slug}')">
          <div class="feed-full-item-top">
            <span class="wgn-badge ${BADGE_CLASS[p.type] || 'badge-tip'}">${p.badge}</span>
            <span class="feed-full-nursery">${name}</span>
            <span style="margin-left:auto;font-size:.7rem;color:var(--text3)">${timeAgo(p.created_at)}</span>
          </div>
          <div class="feed-full-text">${p.text}</div>
          <div class="feed-full-meta">
            <span>${SOURCE_ICON[p.source_type] || '👤'} ${p.source}</span>
          </div>
        </div>`;
      }).join('')
    : '<p style="color:var(--text3);padding:40px 0;text-align:center">No community updates yet.</p>';

  el.innerHTML = `
    <nav class="breadcrumb">
      <a href="#/dayton" onclick="navigate('/dayton')">LocallyGreen</a>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      <a href="#/dayton" onclick="navigate('/dayton')">Dayton</a>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      <span>What's Good Now</span>
    </nav>
    <div class="feed-page-hd">
      <h1>What's Good Now</h1>
      <div class="wgn-live">Live from Dayton</div>
    </div>
    ${listHTML}`;
}
