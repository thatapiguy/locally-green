import { all, filtered } from './state.js';
import { tc } from './data.js';

export function renderGrid() {
  const data = filtered();
  document.getElementById('stat-total').textContent = all().length;
  document.getElementById('dir-meta').textContent = `Showing ${data.length} of ${all().length} locations`;
  const grid = document.getElementById('grid');
  if (data.length === 0) {
    grid.innerHTML = `<div class="empty"><h3>No results found</h3><p>Try a different search, or <span style="color:var(--fern);cursor:pointer" onclick="document.getElementById('overlay').classList.add('open')">add a missing listing</span>.</p></div>`;
    return;
  }
  grid.innerHTML = data.map((n, i) => {
    const c = tc(n);
    return `<a class="ncard" href="#/nursery/${n.slug || n.id}" onclick="navigate('/nursery/${n.slug || n.id}')" style="animation-delay:${i * 40}ms">
      <div class="ncard-accent" style="background:linear-gradient(90deg,${c},${c}88)"></div>
      <div class="ncard-body">
        <div class="ncard-tags">
          <span class="ntag">${n.type}</span>
          ${n.userAdded ? '<span class="ntag community">Community</span>' : ''}
        </div>
        <div class="ncard-name">${n.name}</div>
        <div class="ncard-addr">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${n.city}, OH
        </div>
        <div class="ncard-desc">${n.desc}</div>
      </div>
      <div class="ncard-foot">
        ${n.website ? `<span class="ncard-link"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/></svg> Website</span>` : ''}
        <span class="ncard-cta">View profile <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
      </div>
    </a>`;
  }).join('');
}
