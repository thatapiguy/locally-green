import { state, all } from './state.js';
import { setMeta, injectCitySchema } from './seo.js';
import { renderWGN } from './wgn.js';
import { renderGrid } from './grid.js';
import { renderMap } from './map.js';
import { renderDetail } from './detail.js';

export function navigate(path) {
  history.pushState(null, '', '#' + path);
  route(path);
}

export function route(path) {
  const cityPage   = document.getElementById('page-city');
  const detailPage = document.getElementById('page-detail');

  if (path === '/dayton' || path === '/') {
    cityPage.classList.add('active');
    detailPage.classList.remove('active');
    setMeta(
      'LocallyGreen Dayton — Local Nurseries & Greenhouses',
      'Find the best local nurseries, greenhouses, and garden centers in Dayton, Ohio. Community-maintained, always fresh.',
      'https://locallygreen.com/dayton'
    );
    injectCitySchema();
    renderWGN();
    if (state.currentView === 'grid') renderGrid(); else renderMap();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (path.startsWith('/nursery/')) {
    const slug = path.replace('/nursery/', '');
    const n    = all().find(x => (x.slug || x.id) === slug);
    if (!n) { navigate('/dayton'); return; }
    cityPage.classList.remove('active');
    detailPage.classList.add('active');
    renderDetail(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    navigate('/dayton');
  }
}
