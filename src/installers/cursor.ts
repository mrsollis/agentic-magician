import path from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { getPluginDir } from '../utils/template-resolver.js';
import { readDirFiles, readFile, writeFile, fileExists } from '../utils/fs.js';
import { convertToMdc } from '../converter/to-mdc.js';
import type { InstallPlan, InstallResult } from '../types.js';

export async function installCursor(
  plan: InstallPlan,
  onConflict: (relativePath: string) => Promise<'overwrite' | 'skip' | 'overwrite-all' | 'skip-all'>,
): Promise<InstallResult> {
  const rulesDir = path.join(plan.targetDir, '.cursor', 'rules');

  let filesWritten = 0;
  let filesSkipped = 0;
  let bulkAction: 'overwrite-all' | 'skip-all' | null = null;

  // Track installed filenames to detect collisions
  const installedRules = new Map<string, string>(); // filename → plugin name

  for (const pluginName of plan.plugins) {
    const pluginDir = getPluginDir(pluginName);

    // Only agent files are converted to Cursor rules
    // (commands and skills are Claude-specific)
    const agentFiles = await readDirFiles(path.join(pluginDir, 'agents'), '.md');

    for (const file of agentFiles) {
      const mdcName = file.replace(/\.md$/, '.mdc');
      let targetName = mdcName;

      // Handle cross-plugin collision
      if (installedRules.has(mdcName)) {
        targetName = `${pluginName}--${mdcName}`;
        p.log.warn(
          `Rule ${pc.yellow(mdcName)} exists from ${pc.cyan(installedRules.get(mdcName)!)}, saving as ${pc.cyan(targetName)}`,
        );
      }

      const dest = path.join(rulesDir, targetName);

      // Check for existing file conflict
      if (await fileExists(dest)) {
        if (bulkAction === 'skip-all') {
          filesSkipped++;
          installedRules.set(mdcName, pluginName);
          continue;
        }
        if (bulkAction !== 'overwrite-all') {
          const rel = path.relative(plan.targetDir, dest);
          const action = await onConflict(rel);
          if (action === 'overwrite-all') bulkAction = 'overwrite-all';
          else if (action === 'skip-all') bulkAction = 'skip-all';
          if (action === 'skip' || action === 'skip-all') {
            filesSkipped++;
            installedRules.set(mdcName, pluginName);
            continue;
          }
        }
      }

      // Read source, convert to .mdc, write
      const srcPath = path.join(pluginDir, 'agents', file);
      const srcContent = await readFile(srcPath);
      const mdcContent = convertToMdc(srcContent, pluginName);
      await writeFile(dest, mdcContent);

      filesWritten++;
      installedRules.set(mdcName, pluginName);
    }
  }

  return { filesWritten, filesSkipped };
}
