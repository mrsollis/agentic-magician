// Maps plugin names to Cursor glob patterns for .mdc files.
// Plugins not in this map get no globs (description-only rules).

const PLUGIN_GLOB_MAP: Record<string, string[]> = {
  // Language-specific
  'python-development': ['**/*.py'],
  'javascript-typescript': ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  'multi-platform-apps': ['**/*.dart', '**/pubspec.yaml'],

  // Frontend
  'frontend-mobile-development': ['**/*.tsx', '**/*.jsx', '**/*.css', '**/*.scss'],
  'ui-design': ['**/*.tsx', '**/*.jsx', '**/*.css', '**/*.scss'],
  'accessibility-compliance': ['**/*.tsx', '**/*.jsx', '**/*.html'],
  'seo-technical-optimization': ['**/*.tsx', '**/*.jsx', '**/*.html'],

  // Backend / API
  'backend-development': ['**/*.ts', '**/*.js', '**/*.py'],
  'api-scaffolding': ['**/*.ts', '**/*.js', '**/*.py'],
  'backend-api-security': ['**/*.ts', '**/*.js', '**/*.py'],

  // Infrastructure
  'cloud-infrastructure': ['**/*.tf', '**/*.yaml', '**/*.yml', '**/Dockerfile'],
  'cicd-automation': ['**/.github/**', '**/Dockerfile', '**/*.yaml', '**/*.yml'],
  'deployment-strategies': ['**/*.yaml', '**/*.yml', '**/Dockerfile'],

  // Database
  'database-design': ['**/*.sql', '**/*.prisma', '**/schema.*'],
  'database-migrations': ['**/migrations/**', '**/*.sql'],

  // Security
  'frontend-mobile-security': ['**/*.tsx', '**/*.jsx', '**/*.ts'],

  // Testing
  'unit-testing': ['**/*.test.*', '**/*.spec.*', '**/__tests__/**'],
  'tdd-workflows': ['**/*.test.*', '**/*.spec.*'],
  'performance-testing-review': ['**/*.test.*', '**/*.bench.*'],

  // Dependency
  'dependency-management': ['**/package.json', '**/package-lock.json', '**/yarn.lock'],
};

// Plugins that should have alwaysApply: true in Cursor rules
const ALWAYS_APPLY_PLUGINS = new Set([
  'code-refactoring',
  'git-pr-workflows',
  'error-debugging',
  'error-diagnostics',
  'comprehensive-review',
  'debugging-toolkit',
  'developer-essentials',
  'application-performance',
  'codebase-cleanup',
]);

export function getGlobsForPlugin(pluginName: string): string[] {
  return PLUGIN_GLOB_MAP[pluginName] ?? [];
}

export function isAlwaysApply(pluginName: string): boolean {
  return ALWAYS_APPLY_PLUGINS.has(pluginName);
}
