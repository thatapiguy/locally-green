export const TYPE_COLOR = {
  'Garden Center': '#b85c30',
  'Greenhouse':    '#5a9b6b',
  'Nursery':       '#3d6b4a',
  'Wholesale':     '#d4924a',
};

export function tc(n) {
  return n.userAdded ? '#a0a0a0' : (TYPE_COLOR[n.type] || '#888');
}

export const BADGE_CLASS = {
  arrival: 'badge-arrival',
  bloom:   'badge-bloom',
  sale:    'badge-sale',
  tip:     'badge-tip',
  owner:   'badge-owner',
};

export const SOURCE_ICON = { owner: '🌿', community: '👤', reddit: '🔗' };
