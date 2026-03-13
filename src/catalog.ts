import { readFile } from './utils/fs.js';
import { getManifestPath } from './utils/template-resolver.js';
import type { PluginManifestEntry } from './types.js';

let _manifest: PluginManifestEntry[] | null = null;

export async function getManifest(): Promise<PluginManifestEntry[]> {
  if (_manifest) return _manifest;
  const raw = await readFile(getManifestPath());
  _manifest = JSON.parse(raw) as PluginManifestEntry[];
  return _manifest;
}

export async function getPluginByName(name: string): Promise<PluginManifestEntry | undefined> {
  const manifest = await getManifest();
  return manifest.find((p) => p.name === name);
}

export async function getAvailableExtras(alreadySelected: string[]): Promise<PluginManifestEntry[]> {
  const manifest = await getManifest();
  const selectedSet = new Set(alreadySelected);
  return manifest.filter((p) => !selectedSet.has(p.name));
}
