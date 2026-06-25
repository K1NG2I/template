import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;

export function getSupabase() {
  if (!client && supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

export async function uploadFile(file, bucket = 'assets') {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');

  const isVideo = file.type.startsWith('video/');
  const subdir = isVideo ? 'videos' : 'images';
  const ext = file.name.split('.').pop();
  const path = `${subdir}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await sb.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;

  const { data: { publicUrl } } = sb.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}
