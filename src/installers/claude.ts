import path from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { getPluginDir } from '../utils/template-resolver.js';
import { copyFile, copyDir, fileExists, readDirFiles, readDirSubdirs } from '../utils/fs.js';
import type { InstallPlan, InstallResult } from '../types.js';

export async function installClaude(
  plan: InstallPlan,
  onConflict: (relativePath: string) => Promise<'overwrite' | 'skip' | 'overwrite-all' | 'skip-all'>,
): Promise<InstallResult> {
  const baseDir = path.join(plan.targetDir, '.claude');
  const agentsDir = path.join(baseDir, 'agents');
  const commandsDir = path.join(baseDir, 'commands');
  const skillsDir = path.join(baseDir, 'skills');

  let filesWritten = 0;
  let filesSkipped = 0;
  let bulkAction: 'overwrite-all' | 'skip-all' | null = null;

  // Track installed filenames to detect collisions across plugins
  const installedAgents = new Map<string, string>(); // filename → plugin name
  const installedCommands = new Map<string, string>();

  for (const pluginName of plan.plugins) {
    const pluginDir = getPluginDir(pluginName);

    // Install agents
    const agentFiles = await readDirFiles(path.join(pluginDir, 'agents'), '.md');
    for (const file of agentFiles) {
      let targetName = file;

      // Handle cross-plugin collision
      if (installedAgents.has(file)) {
        targetName = `${pluginName}--${file}`;
        p.log.warn(
          `Agent ${pc.yellow(file)} exists from ${pc.cyan(installedAgents.get(file)!)}, saving as ${pc.cyan(targetName)}`,
        );
      }

      const src = path.join(pluginDir, 'agents', file);
      const dest = path.join(agentsDir, targetName);
      const result = await installFile(src, dest, plan.targetDir, bulkAction, onConflict);
      bulkAction = result.bulkAction;
      if (result.written) filesWritten++;
      else filesSkipped++;
      installedAgents.set(file, pluginName);
    }

    // Install commands
    const commandFiles = await readDirFiles(path.join(pluginDir, 'commands'), '.md');
    for (const file of commandFiles) {
      let targetName = file;

      if (installedCommands.has(file)) {
        targetName = `${pluginName}--${file}`;
        p.log.warn(
          `Command ${pc.yellow(file)} exists from ${pc.cyan(installedCommands.get(file)!)}, saving as ${pc.cyan(targetName)}`,
        );
      }

      const src = path.join(pluginDir, 'commands', file);
      const dest = path.join(commandsDir, targetName);
      const result = await installFile(src, dest, plan.targetDir, bulkAction, onConflict);
      bulkAction = result.bulkAction;
      if (result.written) filesWritten++;
      else filesSkipped++;
      installedCommands.set(file, pluginName);
    }

    // Install skills (copy entire directories)
    const skillDirs = await readDirSubdirs(path.join(pluginDir, 'skills'));
    for (const skillName of skillDirs) {
      const src = path.join(pluginDir, 'skills', skillName);
      const dest = path.join(skillsDir, skillName);

      if (await fileExists(dest)) {
        if (bulkAction === 'skip-all') {
          filesSkipped++;
          continue;
        }
        if (bulkAction !== 'overwrite-all') {
          const rel = path.relative(plan.targetDir, dest);
          const action = await onConflict(rel);
          if (action === 'overwrite-all') bulkAction = 'overwrite-all';
          else if (action === 'skip-all') bulkAction = 'skip-all';
          if (action === 'skip' || action === 'skip-all') {
            filesSkipped++;
            continue;
          }
        }
      }

      await copyDir(src, dest);
      filesWritten++;
    }
  }

  return { filesWritten, filesSkipped };
}

async function installFile(
  src: string,
  dest: string,
  targetDir: string,
  bulkAction: 'overwrite-all' | 'skip-all' | null,
  onConflict: (relativePath: string) => Promise<'overwrite' | 'skip' | 'overwrite-all' | 'skip-all'>,
): Promise<{ written: boolean; bulkAction: typeof bulkAction }> {
  if (await fileExists(dest)) {
    if (bulkAction === 'skip-all') {
      return { written: false, bulkAction };
    }
    if (bulkAction !== 'overwrite-all') {
      const rel = path.relative(targetDir, dest);
      const action = await onConflict(rel);
      if (action === 'overwrite-all') bulkAction = 'overwrite-all';
      else if (action === 'skip-all') bulkAction = 'skip-all';
      if (action === 'skip' || action === 'skip-all') {
        return { written: false, bulkAction };
      }
    }
  }

  await copyFile(src, dest);
  return { written: true, bulkAction };
}
