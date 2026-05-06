import { getWGNSeed } from './state.js';
import { tc, BADGE_CLASS, SOURCE_ICON } from './data.js';
import { mkIcon } from './map.js';
import { setMeta, injectNurserySchema } from './seo.js';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function renderDetail(n) {
  const today   = DAYS[new Date().getDay()];
  const c       = tc(n);
  const wgnSeed = getWGNSeed();

  const hoursRows = n.hours
    ? Object.entries(n.hours).map(([d, h]) => `
        <tr class="${d === today ? 'today' : ''}">
          <td>${d}</td>
          <td>${h}${d === today && h !== 'Closed' ? '<span class="open-badge">Open today</span>' : ''}</td>
        </tr>`).join('')
    : '<tr><td colspan="2" style="color:var(--text3)">Hours not listed</td></tr>';

  const specs = (n.specialties || []).map(s => `<span class="spec-tag">${s}</span>`).join('');

  const feedItems = wgnSeed.filter(p => n.name.includes(p.nursery.split(' ')[0])).slice(0, 3);
  const feedHTML  = feedItems.length
    ? feedItems.map(p => `
        <div class="feed-item">
          <div class="feed-dot-col">
            <div class="feed-dot-outer" style="background:${c}22">
              <div style="width:6px;height:6px;border-radius:50%;background:${c}"></div>
            </div>
          </div>
          <div class="feed-content">
            <div class="feed-badge-row">
              <span class="wgn-badge ${BADGE_CLASS[p.type] || 'badge-tip'}">${p.badge}</span>
              <span style="font-size:.7rem;color:var(--text3)">${p.time}</span>
            </div>
            <div class="feed-text">${p.text}</div>
            <div class="feed-meta"><span>${SOURCE_ICON[p.sourceType]} ${p.source}</span></div>
          </div>
        </div>`).join('')
    : `<p style="font-size:.84rem;color:var(--text3);padding:8px 0">No recent updates. <span style="color:var(--fern);cursor:pointer">Add one?</span></p>`;

  const mapSection = n.lat ? `
    <div class="detail-card">
      <div class="detail-card-title">Location</div>
      <div id="detail-map"></div>
      ${n.address && !n.address.startsWith('Dayton') ? `<p style="font-size:.8rem;color:var(--text2);margin-top:10px">${n.address}</p>` : ''}
    </div>` : '';

  document.getElementById('detail-content').innerHTML = `
    <nav class="breadcrumb" aria-label="breadcrumb">
      <a href="#/dayton" onclick="navigate('/dayton')">LocallyGreen</a>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      <a href="#/dayton" onclick="navigate('/dayton')">Dayton</a>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      <span>${n.name}</span>
    </nav>

    <div class="detail-hero">
      <div class="detail-hero-accent" style="background:linear-gradient(90deg,${c},${c}66)"></div>
      <div class="detail-hero-body">
        <div class="detail-tags">
          <span class="ntag">${n.type}</span>
          ${n.userAdded
            ? '<span class="ntag community">Community Added</span>'
            : '<span class="ntag" style="background:#e8f4e8;color:#2a5e2a">✓ Verified Listing</span>'}
        </div>
        <div class="detail-hero-top">
          <div style="flex:1">
            <h1 class="detail-name">${n.name}</h1>
            <div class="detail-meta">
              <div class="detail-meta-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${n.address || n.city + ', OH'}
              </div>
              ${n.phone ? `<div class="detail-meta-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="tel:${n.phone}">${n.phone}</a>
              </div>` : ''}
              ${n.website ? `<div class="detail-meta-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/></svg>
                <a href="${n.website}" target="_blank">${n.website.replace('https://', '')}</a>
              </div>` : ''}
              <div class="detail-meta-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${n.city}, Ohio · USDA Zone 5b/6a
              </div>
            </div>
          </div>
          <div class="detail-actions">
            ${n.website ? `<a class="action-btn primary" href="${n.website}" target="_blank">Visit website</a>` : ''}
            ${n.phone
              ? `<a class="action-btn secondary" href="tel:${n.phone}">Call now</a>`
              : `<button class="action-btn secondary" onclick="document.getElementById('overlay').classList.add('open')">Suggest edit</button>`}
          </div>
        </div>
      </div>
    </div>

    <div class="detail-grid">
      <div>
        <div class="detail-card">
          <div class="detail-card-title">About</div>
          <p class="detail-desc">${n.desc}</p>
        </div>
        ${specs ? `<div class="detail-card">
          <div class="detail-card-title">Specialties</div>
          <div class="specialties">${specs}</div>
        </div>` : ''}
        <div class="detail-card">
          <div class="detail-card-title" style="display:flex;align-items:center;gap:10px">
            What's Good Now
            <span class="wgn-live" style="font-size:.65rem">Community feed</span>
          </div>
          ${feedHTML}
        </div>
      </div>
      <div>
        <div class="detail-card">
          <div class="detail-card-title">Hours</div>
          <table class="hours-table"><tbody>${hoursRows}</tbody></table>
          <p style="font-size:.72rem;color:var(--text3);margin-top:12px">Hours may vary seasonally. Call ahead to confirm.</p>
        </div>
        ${mapSection}
      </div>
    </div>`;

  if (n.lat) {
    setTimeout(() => {
      const dm = L.map('detail-map', { zoomControl: false, dragging: false, scrollWheelZoom: false })
        .setView([n.lat, n.lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '', maxZoom: 19 }).addTo(dm);
      L.marker([n.lat, n.lng], { icon: mkIcon(c) }).addTo(dm);
    }, 80);
  }

  injectNurserySchema(n);
  setMeta(
    `${n.name} — LocallyGreen Dayton`,
    `${n.type} in ${n.city}, Ohio. ${n.desc.slice(0, 140)}…`,
    `https://locallygreen.com/dayton/${n.slug}`
  );
}
