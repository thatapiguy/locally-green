import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const URL = 'https://dnlmkypopabjprsklfqc.supabase.co';
const KEY = 'sb_publishable_EdT4NXS0ZCkK4mP37cRYEA_rIy-Zzfl';

export const db = createClient(URL, KEY);
