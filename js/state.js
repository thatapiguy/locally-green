import { db } from './supabase.js';

export const state = {
  nurseries:      [],
  feed:           [],
  activeFilter:   'all',
  searchTerm:     '',
  currentView:    'map',
  mapInstance:    null,
  markers:        [],
  activeMarkerId: null,
};

export async function load() {
  const [{ data: nurseries, error: ne }, { data: feed, error: fe }] = await Promise.all([
    db.from('nurseries')
      .select('*')
      .eq('status', 'verified')
      .order('name'),
    db.from('feed_posts')
      .select('*, nurseries(name, slug)')
      .eq('status', 'visible')
      .order('created_at', { ascending: false })
      .limit(30),
  ]);
  if (ne || fe) throw new Error(ne?.message || fe?.message);
  // normalise description → desc so existing render code keeps working
  state.nurseries = (nurseries || []).map(n => ({ ...n, desc: n.description }));
  state.feed      = feed || [];
}

export function all()      { return state.nurseries; }
export function getWGNSeed() { return state.feed; }

export function filtered() {
  return state.nurseries.filter(n => {
    const q  = state.searchTerm.toLowerCase();
    const ms = !q
      || n.name.toLowerCase().includes(q)
      || n.city.toLowerCase().includes(q)
      || (n.description || '').toLowerCase().includes(q)
      || n.type.toLowerCase().includes(q)
      || (n.specialties || []).join(' ').toLowerCase().includes(q);
    const mf = state.activeFilter === 'all' || n.type === state.activeFilter;
    return ms && mf;
  });
}
