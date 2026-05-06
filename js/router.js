import { state, all } from './state.js';
import { setMeta, injectCitySchema } from './seo.js';
import { renderWGN, renderFeedPage } from './wgn.js';
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
  const feedPage   = document.getElementById('page-feed');

  [cityPage, detailPage, feedPage].forEach(p => p.classList.remove('active'));

  if (path === '/dayton' || path === '/') {
    cityPage.classList.add('active');
    setMeta(
      'LocallyGreen Dayton — Local Nurseries & Greenhouses',
      'Find the best local nurseries, greenhouses, and garden centers in Dayton, Ohio. Community-maintained, always fresh.',
      'https://locallygreen.com/dayton'
    );
    injectCitySchema();
    renderWGN();
    if (state.currentView === 'grid') renderGrid(); else renderMap();
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } else if (path === '/feed') {
    feedPage.classList.add('active');
    renderFeedPage();
    setMeta(
      'What\'s Good Now — LocallyGreen Dayton',
      'Live community updates from Dayton nurseries — arrivals, blooms, sales, and tips.',
      'https://locallygreen.com/dayton/feed'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } else if (path.startsWith('/nursery/')) {
    const slug = path.replace('/nursery/', '');
    const n    = all().find(x => (x.slug || x.id) === slug);
    if (!n) { navigate('/dayton'); return; }
    detailPage.classList.add('active');
    renderDetail(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } else {
    navigate('/dayton');
  }
}
