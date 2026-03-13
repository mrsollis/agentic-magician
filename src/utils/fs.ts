import { mkdir, access, copyFile as fsCopyFile, readdir, readFile as fsReadFile, writeFile as fsWriteFile, stat, cp } from 'node:fs/promises';
import path from 'node:path';

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function copyFile(src: string, dest: string): Promise<void> {
  await ensureDir(path.dirname(dest));
  await fsCopyFile(src, dest);
}

export async function copyDir(src: string, dest: string): Promise<void> {
  await ensureDir(dest);
  await cp(src, dest, { recursive: true });
}

export async function readDir(dir: string): Promise<string[]> {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
}

export async function readDirFiles(dir: string, ext?: string): Promise<string[]> {
  const entries = await readDir(dir);
  if (ext) {
    return entries.filter((e) => e.endsWith(ext));
  }
  return entries;
}

export async function readDirSubdirs(dir: string): Promise<string[]> {
  const entries = await readDir(dir);
  const subdirs: string[] = [];
  for (const entry of entries) {
    try {
      const s = await stat(path.join(dir, entry));
      if (s.isDirectory()) subdirs.push(entry);
    } catch {
      // skip
    }
  }
  return subdirs;
}

export async function readFile(filePath: string): Promise<string> {
  return fsReadFile(filePath, 'utf8');
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fsWriteFile(filePath, content, 'utf8');
}
