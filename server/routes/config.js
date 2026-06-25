import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', 'data', 'config.json');

export async function getConfig(_, res) {
  try {
    const data = await readFile(configPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: 'Failed to read config' });
  }
}

export async function updateConfig(req, res) {
  try {
    await writeFile(configPath, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to write config' });
  }
}
