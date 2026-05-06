export const TYPE_COLOR = {
  'Garden Center': '#b85c30',
  'Greenhouse':    '#5a9b6b',
  'Nursery':       '#3d6b4a',
  'Wholesale':     '#d4924a',
};

export function tc(n) {
  return TYPE_COLOR[n.type] || '#888';
}

export const BADGE_CLASS = {
  arrival: 'badge-arrival',
  bloom:   'badge-bloom',
  sale:    'badge-sale',
  tip:     'badge-tip',
  owner:   'badge-owner',
  event:   'badge-tip',
};

export const BADGE_LABELS = {
  arrival: 'Arrival',
  bloom:   'In Bloom',
  sale:    'Sale',
  tip:     'Tip',
  event:   'Event',
  owner:   'Owner Update',
};

export const SOURCE_ICON = { owner: '🌿', community: '👤', reddit: '🔗' };

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days}d ago`;
}
