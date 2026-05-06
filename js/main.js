import { state, setSeedData, load } from './state.js';
import { navigate, route } from './router.js';
import { openWGN } from './wgn.js';
import { mapClick } from './map.js';
import { switchView, submitListing, sharePage } from './ui.js';
import { renderGrid } from './grid.js';
import { renderMap } from './map.js';

async function init() {
  let nurseries, feed;
  try {
    [nurseries, feed] = await Promise.all([
      fetch('data/nurseries.json').then(r => r.json()),
      fetch('data/feed.json').then(r => r.json()),
    ]);
  } catch {
    document.body.innerHTML = `
      <div style="padding:60px;text-align:center;font-family:'DM Sans',sans-serif;color:#2e2016">
        <h2 style="font-family:'Lora',serif;font-size:1.6rem;margin-bottom:12px">Unable to load data</h2>
        <p style="color:#6b5e52;line-height:1.7">LocallyGreen must be served from an HTTP server.<br>
        Run: <code style="background:#f0ebe2;padding:3px 8px;border-radius:5px">python3 -m http.server 8080</code><br>
        then open <a href="http://localhost:8080" style="color:#3d6b4a">http://localhost:8080</a></p>
      </div>`;
    return;
  }

  setSeedData(nurseries, feed);
  await load();

  // Expose globals required by inline onclick attributes in HTML and injected innerHTML
  window.navigate      = navigate;
  window.submitListing = submitListing;
  window.openWGN       = openWGN;
  window.mapClick      = mapClick;
  window.sharePage     = sharePage;

  document.getElementById('search').addEventListener('input', e => {
    state.searchTerm = e.target.value;
    if (state.currentView === 'grid') renderGrid(); else renderMap();
  });

  document.querySelectorAll('.pill').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      b.classList.add('active');
      state.activeFilter = b.dataset.filter;
      if (state.currentView === 'grid') renderGrid(); else renderMap();
    });
  });

  document.getElementById('btn-grid').addEventListener('click', () => switchView('grid'));
  document.getElementById('btn-map').addEventListener('click', () => switchView('map'));
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('overlay')) {
      document.getElementById('overlay').classList.remove('open');
    }
  });

  window.addEventListener('popstate', () => route(location.hash.slice(1) || '/dayton'));

  route(location.hash.slice(1) || '/dayton');
}

init();
