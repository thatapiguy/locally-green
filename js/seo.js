import { all } from './state.js';

export function setMeta(title, desc, canonical) {
  document.getElementById('page-title').textContent = title;
  document.getElementById('page-desc').setAttribute('content', desc);
  document.getElementById('og-title').setAttribute('content', title);
  document.getElementById('og-desc').setAttribute('content', desc);
  document.getElementById('canonical').setAttribute('href', canonical);
}

export function injectCitySchema() {
  const items = all().map((n, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'item': {
      '@type': 'LocalBusiness',
      'name': n.name,
      'address': { '@type': 'PostalAddress', 'addressLocality': n.city, 'addressRegion': 'OH', 'addressCountry': 'US' },
      'url': n.website || `https://locallygreen.com/dayton/${n.slug || n.id}`,
      ...(n.lat ? { 'geo': { '@type': 'GeoCoordinates', 'latitude': n.lat, 'longitude': n.lng } } : {}),
    },
  }));
  document.getElementById('json-ld').textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Nurseries and Greenhouses in Dayton, Ohio',
    'description': 'A community-curated directory of local nurseries, greenhouses, and garden centers in the Dayton, Ohio metropolitan area.',
    'url': 'https://locallygreen.com/dayton',
    'itemListElement': items,
  }, null, 2);
}

export function injectNurserySchema(n) {
  document.getElementById('json-ld').textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'GardenStore'],
    'name': n.name,
    'description': n.desc,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': n.address.split(',')[0] || '',
      'addressLocality': n.city,
      'addressRegion': 'OH',
      'addressCountry': 'US',
    },
    ...(n.phone   ? { 'telephone': n.phone }   : {}),
    ...(n.website ? { 'url': n.website }        : {}),
    ...(n.lat     ? { 'geo': { '@type': 'GeoCoordinates', 'latitude': n.lat, 'longitude': n.lng } } : {}),
    'servesCuisine': n.specialties?.join(', '),
    'openingHours': n.hours
      ? Object.entries(n.hours).filter(([, v]) => v !== 'Closed').map(([d, h]) => d.slice(0, 2) + ' ' + h).join(', ')
      : undefined,
    'isPartOf': { '@type': 'WebSite', 'name': 'LocallyGreen', 'url': 'https://locallygreen.com' },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'LocallyGreen', 'item': 'https://locallygreen.com' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Dayton',       'item': 'https://locallygreen.com/dayton' },
        { '@type': 'ListItem', 'position': 3, 'name': n.name,         'item': `https://locallygreen.com/dayton/${n.slug}` },
      ],
    },
  }, null, 2);
}
