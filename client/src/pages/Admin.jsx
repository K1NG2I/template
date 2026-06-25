import { useState } from 'react';
import axios from 'axios';
import { useConfig } from '../context/ConfigContext';
import { uploadFile } from '../lib/supabase';

function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch {
      alert('Upload failed');
    }
    setUploading(false);
  }

  return (
    <div className="flex items-start gap-4">
      <div className="w-20 h-20 bg-[var(--bg-secondary)] overflow-hidden flex-shrink-0 border border-[var(--border)]">
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">
            No Image
          </div>
        )}
      </div>
      <div className="flex-1">
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)] mb-2" placeholder="Image URL" />
        <label className="inline-block bg-[var(--bg-secondary)] text-[var(--primary)] px-4 py-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity">
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

function VideoUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch {
      alert('Upload failed');
    }
    setUploading(false);
  }

  return (
    <div className="flex items-start gap-4">
      <div className="w-40 h-24 bg-[var(--bg-secondary)] overflow-hidden flex-shrink-0 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] text-xs">
        {value ? (
          <span className="text-[var(--primary)] text-sm">Video selected</span>
        ) : (
          'No Video'
        )}
      </div>
      <div className="flex-1">
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)] mb-2" placeholder="Video URL" />
        <label className="inline-block bg-[var(--bg-secondary)] text-[var(--primary)] px-4 py-2 text-xs cursor-pointer hover:opacity-80 transition-opacity">
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="video/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

function MultiImageUpload({ images, onAdd, onRemove }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onAdd(url);
    } catch {
      alert('Upload failed');
    }
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative group w-16 h-16 overflow-hidden border border-[var(--border)]">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => onRemove(i)}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
        <label className="w-16 h-16 border-2 border-dashed border-[var(--border)] flex items-center justify-center cursor-pointer hover:border-[var(--accent)] transition-colors text-[var(--muted)] text-lg">
          {uploading ? '...' : '+'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
      <input
        type="text"
        value={images.join(', ')}
        onChange={(e) => {
          const urls = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
          while (images.length) onRemove(0);
          urls.forEach((url) => onAdd(url));
        }}
        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2 text-xs text-[var(--muted)]"
        placeholder="Paste image URLs separated by commas"
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] p-5 space-y-4">
      <h2 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2">{title}</h2>
      {children}
    </div>
  );
}

function ColorEditor({ theme, label, colors, update }) {
  const entries = Object.entries(colors);
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-[var(--primary)] mb-2">{label}</h3>
      <div className="space-y-2">
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="color"
              value={val}
              onChange={(e) => update(`colors.${theme}.${key}`, e.target.value)}
              className="w-9 h-9 p-0 border border-[var(--border)] cursor-pointer bg-transparent"
            />
            <span className="text-xs text-[var(--muted)] w-24 flex-shrink-0">{key.replace('--', '')}</span>
            <input
              type="text"
              value={val}
              onChange={(e) => update(`colors.${theme}.${key}`, e.target.value)}
              className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] px-2 py-1.5 text-xs text-[var(--primary)] font-mono"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminForm({ config, setConfig, password }) {
  function update(path, value) {
    const keys = path.split('.');
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function updateCard(section, index, field, value) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[section][index][field] = value;
      return next;
    });
  }

  function addCardImage(section, index, url) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[section][index].images) next[section][index].images = [];
      next[section][index].images.push(url);
      return next;
    });
  }

  function removeCardImage(section, index, imgIndex) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[section][index].images.splice(imgIndex, 1);
      return next;
    });
  }

  function updateProductField(index, field, value) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.products[index][field] = value;
      return next;
    });
  }

  function addProductImage(index, url) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next.products[index].images) next.products[index].images = [];
      next.products[index].images.push(url);
      return next;
    });
  }

  function removeProductImage(index, imgIndex) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.products[index].images.splice(imgIndex, 1);
      return next;
    });
  }

  function addProduct() {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next.products) next.products = [];
      next.products.push({ title: 'New Product', images: [], synopsis: '', description: '', featured: false });
      return next;
    });
  }

  function removeProduct(index) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.products.splice(index, 1);
      return next;
    });
  }

  function addShowcaseItem() {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next.showcase) next.showcase = { heading: 'Showcase', cards: [] };
      next.showcase.cards.push({ title: 'New Card', image: '', synopsis: '' });
      return next;
    });
  }

  function removeShowcaseItem(index) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.showcase.cards.splice(index, 1);
      return next;
    });
  }

  function updateShowcaseItem(index, field, value) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.showcase.cards[index][field] = value;
      return next;
    });
  }

  function addRule() {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.about.rules.push('New rule');
      return next;
    });
  }

  function updateRule(index, value) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.about.rules[index] = value;
      return next;
    });
  }

  function removeRule(index) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.about.rules.splice(index, 1);
      return next;
    });
  }

  function addNavLink() {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.header.navLinks.push({ label: 'New Link', path: '/new' });
      return next;
    });
  }

  function updateNavLink(index, field, value) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.header.navLinks[index][field] = value;
      return next;
    });
  }

  function removeNavLink(index) {
    setConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.header.navLinks.splice(index, 1);
      return next;
    });
  }

  async function handleSave() {
    try {
      await axios.put('/api/config', config, {
        headers: { 'x-admin-password': password },
      });
      alert('Saved successfully!');
    } catch {
      alert('Failed to save');
    }
  }

  return (
    <div className="space-y-6">
      <Section title="Header">
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Logo</label>
          <ImageUpload value={config.header.logo} onChange={(v) => update('header.logo', v)} />
          <div className="flex gap-2 mt-2">
            <div className="flex-1">
              <label className="block text-xs text-[var(--muted)] mb-1">Width (px)</label>
              <input type="number" value={config.header.logoWidth || ''} onChange={(e) => update('header.logoWidth', Number(e.target.value))} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[var(--muted)] mb-1">Height (px)</label>
              <input type="number" value={config.header.logoHeight || ''} onChange={(e) => update('header.logoHeight', Number(e.target.value))} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--primary)]" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Nav Links</label>
          <div className="space-y-2">
            {config.header.navLinks.map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={link.label} onChange={(e) => updateNavLink(i, 'label', e.target.value)} className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" placeholder="Label" />
                <input type="text" value={link.path} onChange={(e) => updateNavLink(i, 'path', e.target.value)} className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" placeholder="/path" />
                <button onClick={() => removeNavLink(i)} className="text-[var(--primary)] opacity-60 hover:opacity-100 text-sm">Remove</button>
              </div>
            ))}
          </div>
          <button onClick={addNavLink} className="mt-2 text-xs text-[var(--primary)] opacity-60 hover:opacity-100">+ Add Link</button>
        </div>
      </Section>

      <Section title="Fonts">
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Font Family</label>
          <select
            value={config.fonts?.family || ''}
            onChange={(e) => update('fonts.family', e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--primary)] mb-2"
          >
            <option value="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">Inter (Default)</option>
            <option value="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif">System UI</option>
            <option value="Georgia, 'Times New Roman', serif">Georgia / Serif</option>
            <option value="'Courier New', Courier, monospace">Courier / Monospace</option>
            <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
            <option value="custom">Custom...</option>
          </select>
          <input
            type="text"
            value={config.fonts?.family || ''}
            onChange={(e) => update('fonts.family', e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--primary)] mb-2"
            placeholder="Custom font-family value (e.g. 'Helvetica Neue', Arial, sans-serif)"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Google Fonts Link</label>
          <input
            type="text"
            value={config.fonts?.googleFontLink || ''}
            onChange={(e) => update('fonts.googleFontLink', e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--primary)]"
            placeholder="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          />
          <p className="text-xs text-[var(--muted)] mt-1">Paste the full Google Fonts URL. Then set the font family above to match.</p>
        </div>
      </Section>

      <Section title="Hero Section">
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Video</label>
          <VideoUpload value={config.hero.video} onChange={(v) => update('hero.video', v)} />
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Poster Image</label>
          <ImageUpload value={config.hero.posterImage} onChange={(v) => update('hero.posterImage', v)} />
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Headline</label>
          <input type="text" value={config.hero.headline} onChange={(e) => update('hero.headline', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" />
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Subtext</label>
          <input type="text" value={config.hero.subtext} onChange={(e) => update('hero.subtext', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-[var(--muted)] mb-1">CTA Text</label>
            <input type="text" value={config.hero.ctaText} onChange={(e) => update('hero.ctaText', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-[var(--muted)] mb-1">CTA Link</label>
            <input type="text" value={config.hero.ctaLink} onChange={(e) => update('hero.ctaLink', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" />
          </div>
        </div>
      </Section>

      <Section title="Shop Flash">
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Heading</label>
          <input type="text" value={config.shopFlash.heading} onChange={(e) => update('shopFlash.heading', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" />
        </div>
      </Section>

      <Section title="Products">
        {(config.products || []).map((card, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--primary)] font-medium">Product {i + 1}</span>
              <button onClick={() => removeProduct(i)} className="text-[var(--primary)] opacity-60 hover:opacity-100 text-xs">Remove</button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!card.featured}
                onChange={(e) => updateProductField(i, 'featured', e.target.checked)}
                className="accent-[var(--accent)]"
              />
              <span className="text-xs text-[var(--muted)]">Featured</span>
            </label>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Title</label>
              <input type="text" value={card.title} onChange={(e) => updateProductField(i, 'title', e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Images</label>
              <MultiImageUpload
                images={card.images || []}
                onAdd={(url) => addProductImage(i, url)}
                onRemove={(imgIdx) => removeProductImage(i, imgIdx)}
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Synopsis</label>
              <textarea value={card.synopsis} onChange={(e) => updateProductField(i, 'synopsis', e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" rows={2} />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Description</label>
              <textarea value={card.description || ''} onChange={(e) => updateProductField(i, 'description', e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" rows={3} />
            </div>
          </div>
        ))}
        <button onClick={() => addProduct()} className="text-xs text-[var(--primary)] opacity-60 hover:opacity-100">+ Add Product</button>
      </Section>

      <Section title="Showcase">
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Heading</label>
          <input type="text" value={config.showcase?.heading || ''} onChange={(e) => update('showcase.heading', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--primary)]" />
        </div>
        {(config.showcase?.cards || []).map((item, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--primary)] font-medium">Card {i + 1}</span>
              <button onClick={() => removeShowcaseItem(i)} className="text-[var(--primary)] opacity-60 hover:opacity-100 text-xs">Remove</button>
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Title</label>
              <input type="text" value={item.title} onChange={(e) => updateShowcaseItem(i, 'title', e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Image</label>
              <ImageUpload value={item.image} onChange={(v) => updateShowcaseItem(i, 'image', v)} />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Synopsis</label>
              <textarea value={item.synopsis} onChange={(e) => updateShowcaseItem(i, 'synopsis', e.target.value)} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" rows={3} />
            </div>
          </div>
        ))}
        <button onClick={() => addShowcaseItem()} className="text-xs text-[var(--primary)] opacity-60 hover:opacity-100">+ Add Card</button>
      </Section>

      <Section title="About">
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">About Text</label>
          <textarea value={config.about.text} onChange={(e) => update('about.text', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" rows={4} />
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Rules</label>
          <div className="space-y-2">
            {config.about.rules.map((rule, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={rule} onChange={(e) => updateRule(i, e.target.value)} className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" />
                <button onClick={() => removeRule(i)} className="text-[var(--primary)] opacity-60 hover:opacity-100 text-xs">Remove</button>
              </div>
            ))}
          </div>
          <button onClick={addRule} className="mt-2 text-xs text-[var(--primary)] opacity-60 hover:opacity-100">+ Add Rule</button>
        </div>
      </Section>

      <Section title="Footer">
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Footer Text</label>
          <input type="text" value={config.footer.text} onChange={(e) => update('footer.text', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" />
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1">Email</label>
          <input type="text" value={config.footer.email} onChange={(e) => update('footer.email', e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--primary)]" />
        </div>
      </Section>

      <Section title="Colors">
        <p className="text-xs text-[var(--muted)] mb-3">Customize the color scheme for light and dark mode. Changes apply immediately on save.</p>
        <ColorEditor theme="dark" label="Dark Mode" colors={config.colors?.dark || {}} update={update} />
        <ColorEditor theme="light" label="Light Mode" colors={config.colors?.light || {}} update={update} />
      </Section>

      <button onClick={handleSave} className="w-full bg-[var(--primary)] text-[var(--bg)] py-3 font-semibold text-sm hover:opacity-80 transition-opacity">
        Save Configuration
      </button>
    </div>
  );
}

export default function Admin() {
  const { config, setConfig } = useConfig();
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth', { password });
      if (res.data.success) setAuthed(true);
    } catch {
      setError('Wrong password');
    }
  }

  if (!authed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-[var(--card)] border border-[var(--border)] p-8 w-full max-w-sm space-y-4">
          <h1 className="text-lg font-bold text-center text-[var(--primary)]">Admin Access</h1>
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-sm text-[var(--primary)]"
            autoFocus
          />
          <button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black py-3 font-semibold text-sm hover:opacity-90 transition-opacity">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-lg font-bold text-[var(--primary)] mb-6">Admin Panel</h1>
      <AdminForm config={config} setConfig={setConfig} password={password} />
    </div>
  );
}
