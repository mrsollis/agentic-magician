import * as p from '@clack/prompts';
import pc from 'picocolors';
import { PLATFORM_OPTIONS, PROJECT_TYPE_OPTIONS } from './constants.js';
import { PROJECT_TYPE_PLUGINS } from './mappings.js';
import { getAvailableExtras } from './catalog.js';
import { installClaude } from './installers/claude.js';
import { installCursor } from './installers/cursor.js';
import type { Platform, ProjectType, InstallPlan } from './types.js';

export async function run(): Promise<void> {
  p.intro(pc.bgCyan(pc.black(' agentic-magician ')));

  // 1. Select platform
  const platform = await p.select({
    message: 'Which AI platform are you configuring?',
    options: PLATFORM_OPTIONS,
  });

  if (p.isCancel(platform)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  // 2. Select project type
  const projectType = await p.select({
    message: 'What type of project is this?',
    options: PROJECT_TYPE_OPTIONS,
  });

  if (p.isCancel(projectType)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  // 3. Show default plugins
  const defaultPlugins = PROJECT_TYPE_PLUGINS[projectType as ProjectType];

  p.note(
    defaultPlugins.map((name) => `  ${pc.green('+')} ${name}`).join('\n'),
    `Default plugins for ${projectType} (${defaultPlugins.length})`,
  );

  // 4. Offer cherry-pick
  const wantExtras = await p.confirm({
    message: 'Would you like to add additional plugins?',
    initialValue: false,
  });

  if (p.isCancel(wantExtras)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  let extraPlugins: string[] = [];

  if (wantExtras) {
    const available = await getAvailableExtras(defaultPlugins);
    const options = available.map((plugin) => ({
      value: plugin.name,
      label: plugin.name,
      hint: plugin.description ? plugin.description.slice(0, 60) : undefined,
    }));

    const selected = await p.multiselect({
      message: 'Select additional plugins (space to toggle, enter to confirm)',
      options,
      required: false,
    });

    if (p.isCancel(selected)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    extraPlugins = selected as string[];
  }

  // 5. Confirm
  const allPlugins = [...defaultPlugins, ...extraPlugins];
  const targetLabel = (platform as Platform) === 'claude' ? '.claude/' : '.cursor/rules/';

  p.note(
    allPlugins.map((name) => `  ${pc.cyan('-')} ${name}`).join('\n'),
    `Installing ${allPlugins.length} plugins to ${targetLabel}`,
  );

  const confirmed = await p.confirm({
    message: 'Proceed with installation?',
    initialValue: true,
  });

  if (!confirmed || p.isCancel(confirmed)) {
    p.cancel('Installation cancelled.');
    process.exit(0);
  }

  // 6. Install
  const spinner = p.spinner();
  spinner.start('Installing agent configurations...');

  const plan: InstallPlan = {
    platform: platform as Platform,
    projectType: projectType as ProjectType,
    plugins: allPlugins,
    targetDir: process.cwd(),
  };

  try {
    // Conflict handler - pauses spinner, prompts user, resumes
    const onConflict = async (relativePath: string) => {
      spinner.stop('Paused');

      const action = await p.select({
        message: `File already exists: ${pc.yellow(relativePath)}`,
        options: [
          { value: 'overwrite', label: 'Overwrite', hint: 'Replace with new version' },
          { value: 'skip', label: 'Skip', hint: 'Keep existing file' },
          { value: 'overwrite-all', label: 'Overwrite all', hint: 'Replace all remaining conflicts' },
          { value: 'skip-all', label: 'Skip all', hint: 'Keep all existing files' },
        ],
      });

      if (p.isCancel(action)) {
        p.cancel('Installation cancelled.');
        process.exit(0);
      }

      spinner.start('Installing agent configurations...');
      return action as 'overwrite' | 'skip' | 'overwrite-all' | 'skip-all';
    };

    let result;
    if (plan.platform === 'claude') {
      result = await installClaude(plan, onConflict);
    } else {
      result = await installCursor(plan, onConflict);
    }

    spinner.stop('Installation complete!');

    // 7. Summary
    p.note(
      [
        `Platform:          ${pc.cyan(plan.platform)}`,
        `Project type:      ${pc.cyan(plan.projectType)}`,
        `Plugins installed: ${pc.green(String(allPlugins.length))}`,
        `Files written:     ${pc.green(String(result.filesWritten))}`,
        `Files skipped:     ${pc.yellow(String(result.filesSkipped))}`,
      ].join('\n'),
      'Installation Summary',
    );

    p.outro(pc.green('Done! Your AI agents are ready.'));
  } catch (err) {
    spinner.stop('Installation failed.');
    p.log.error(String(err));
    process.exit(1);
  }
}
