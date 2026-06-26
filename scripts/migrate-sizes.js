import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const localConfig = JSON.parse(
  readFileSync(join(__dirname, '..', 'server', 'data', 'config.json'), 'utf-8')
);

const DEFAULT_SIZES = {
  XS: { available: false, quantity: 0 },
  S: { available: false, quantity: 0 },
  M: { available: false, quantity: 0 },
  L: { available: false, quantity: 0 },
  XL: { available: false, quantity: 0 },
  XXL: { available: false, quantity: 0 },
};

async function migrate() {
  const { data, error } = await supabase
    .from('config')
    .select('data')
    .eq('id', 1)
    .single();

  if (error || !data) {
    console.error('Failed to fetch current config:', error?.message || 'No data');
    process.exit(1);
  }

  const current = data.data;

  current.products = (current.products || []).map((product, i) => {
    if (product.sizes) return product;
    const localProduct = localConfig.products[i];
    return {
      ...product,
      sizes: localProduct?.sizes || DEFAULT_SIZES,
    };
  });

  const { error: updateError } = await supabase
    .from('config')
    .update({ data: current, updated_at: new Date().toISOString() })
    .eq('id', 1);

  if (updateError) {
    console.error('Failed to update config:', updateError.message);
    process.exit(1);
  }

  console.log('Successfully migrated config with sizes!');
}

migrate();
