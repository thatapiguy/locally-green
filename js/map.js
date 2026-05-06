import { state, filtered } from './state.js';
import { tc } from './data.js';

export function mkIcon(c) {
  const s = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">` +
    `<path d="M15 0C6.7 0 0 6.7 0 15c0 10 15 25 15 25S30 25 30 15C30 6.7 23.3 0 15 0z" fill="${c}" stroke="white" stroke-width="2"/>` +
    `<path d="M15 8Q17 12 21 13Q17 15 15 21Q13 15 9 13Q13 12 15 8Z" fill="white" opacity=".9"/></svg>`
  );
  return L.divIcon({
    html: `<img src="data:image/svg+xml,${s}" width="30" height="40">`,
    className: '', iconSize: [30, 40], iconAnchor: [15, 40], popupAnchor: [0, -42],
  });
}

export function renderMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;
  if (!state.mapInstance) {
    state.mapInstance = L.map('map').setView([39.758, -84.192], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors', maxZoom: 19,
    }).addTo(state.mapInstance);
  }
  const data = filtered();
  state.markers.forEach(m => m.marker.remove());
  state.markers = [];
  data.forEach(n => {
    if (!n.lat) return;
    const m = L.marker([n.lat, n.lng], { icon: mkIcon(tc(n)) })
      .addTo(state.mapInstance)
      .bindPopup(
        `<div class="popup-acc" style="background:${tc(n)}"></div><div class="popup-in">` +
        `<div class="popup-type">${n.type}</div>` +
        `<div class="popup-name">${n.name}</div>` +
        `<div class="popup-addr">${n.address || n.city + ', OH'}</div>` +
        `<button class="popup-view" onclick="navigate('/nursery/${n.slug || n.id}')">View profile →</button>` +
        `</div>`,
        { maxWidth: 240 }
      );
    m.on('click', () => { state.activeMarkerId = n.id; renderMapList(data); scrollMapTo(n.id); });
    state.markers.push({ id: n.id, marker: m });
  });
  if (state.markers.length) {
    const g = L.featureGroup(state.markers.map(m => m.marker));
    state.mapInstance.fitBounds(g.getBounds().pad(.15));
  }
  renderMapList(data);
  document.getElementById('map-meta').textContent =
    `${state.markers.length} location${state.markers.length !== 1 ? 's' : ''} shown`;
  setTimeout(() => state.mapInstance.invalidateSize(), 200);
}

export function renderMapList(data) {
  const list = document.getElementById('map-list');
  list.innerHTML = data.filter(n => n.lat).map(n => `
    <div class="map-item ${n.id === state.activeMarkerId ? 'active' : ''}" data-id="${n.id}" onclick="mapClick('${n.id}','${n.slug || n.id}')">
      <div class="map-dot" style="background:${tc(n)}"></div>
      <div>
        <div class="map-item-name">${n.name}</div>
        <div class="map-item-meta">${n.city} · ${n.type}</div>
      </div>
    </div>`).join('');
}

export function mapClick(id) {
  state.activeMarkerId = id;
  renderMapList(filtered());
  const f = state.markers.find(m => m.id === id);
  if (f) { state.mapInstance.setView(f.marker.getLatLng(), 14, { animate: true }); f.marker.openPopup(); }
}

export function scrollMapTo(id) {
  const el = document.querySelector(`.map-item[data-id="${id}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
