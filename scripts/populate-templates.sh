#!/bin/bash
set -euo pipefail

REPO_URL="https://github.com/wshobson/agents.git"
CLONE_DIR=$(mktemp -d)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/../templates/plugins"
MANIFEST_PATH="$SCRIPT_DIR/../templates/plugins.json"

echo "Cloning wshobson/agents (shallow)..."
git clone --depth 1 "$REPO_URL" "$CLONE_DIR"

echo "Clearing existing templates..."
rm -rf "$TEMPLATES_DIR"
mkdir -p "$TEMPLATES_DIR"

echo "Copying plugins..."
count=0
for plugin_dir in "$CLONE_DIR/plugins"/*/; do
  plugin_name=$(basename "$plugin_dir")
  dest="$TEMPLATES_DIR/$plugin_name"

  has_content=false

  # Copy agents/ if exists and has .md files
  if [ -d "$plugin_dir/agents" ] && ls "$plugin_dir/agents/"*.md >/dev/null 2>&1; then
    mkdir -p "$dest/agents"
    cp "$plugin_dir/agents/"*.md "$dest/agents/"
    has_content=true
  fi

  # Copy commands/ if exists and has .md files
  if [ -d "$plugin_dir/commands" ] && ls "$plugin_dir/commands/"*.md >/dev/null 2>&1; then
    mkdir -p "$dest/commands"
    cp "$plugin_dir/commands/"*.md "$dest/commands/"
    has_content=true
  fi

  # Copy skills/ recursively if exists and has subdirectories
  if [ -d "$plugin_dir/skills" ]; then
    # Only copy if there are actual subdirectories with content
    if find "$plugin_dir/skills" -mindepth 1 -maxdepth 1 -type d | head -1 | grep -q .; then
      cp -r "$plugin_dir/skills" "$dest/skills"
      has_content=true
    fi
  fi

  if [ "$has_content" = true ]; then
    count=$((count + 1))
  else
    # Remove empty plugin dirs
    rm -rf "$dest"
  fi
done

echo "Copied $count plugins."

echo "Building plugins manifest..."
NODE_BIN=$(command -v node || echo "")
if [ -z "$NODE_BIN" ]; then
  echo "Warning: node not found, skipping manifest generation."
  echo "[]" > "$MANIFEST_PATH"
else
  "$NODE_BIN" -e "
const fs = require('fs');
const path = require('path');
const cloneDir = '$CLONE_DIR';
const templatesDir = '$TEMPLATES_DIR';
const plugins = [];
const pluginsDir = path.join(cloneDir, 'plugins');

for (const name of fs.readdirSync(pluginsDir).sort()) {
  const pluginPath = path.join(pluginsDir, name);
  if (!fs.statSync(pluginPath).isDirectory()) continue;

  // Read plugin.json if available
  const pjPath = path.join(pluginPath, '.claude-plugin', 'plugin.json');
  let description = '';
  let version = '0.0.0';
  if (fs.existsSync(pjPath)) {
    try {
      const pj = JSON.parse(fs.readFileSync(pjPath, 'utf8'));
      description = pj.description || '';
      version = pj.version || '0.0.0';
    } catch {}
  }

  // Only include plugins we actually copied
  const destPath = path.join(templatesDir, name);
  if (!fs.existsSync(destPath)) continue;

  const agentsDir = path.join(destPath, 'agents');
  const commandsDir = path.join(destPath, 'commands');
  const skillsDir = path.join(destPath, 'skills');

  plugins.push({
    name,
    description,
    version,
    agents: fs.existsSync(agentsDir)
      ? fs.readdirSync(agentsDir).filter(f => f.endsWith('.md')).sort()
      : [],
    commands: fs.existsSync(commandsDir)
      ? fs.readdirSync(commandsDir).filter(f => f.endsWith('.md')).sort()
      : [],
    skills: fs.existsSync(skillsDir)
      ? fs.readdirSync(skillsDir).filter(e => {
          try { return fs.statSync(path.join(skillsDir, e)).isDirectory(); }
          catch { return false; }
        }).sort()
      : [],
  });
}

fs.writeFileSync('$MANIFEST_PATH', JSON.stringify(plugins, null, 2));
console.log('Generated manifest for ' + plugins.length + ' plugins');
"
fi

echo "Cleaning up..."
rm -rf "$CLONE_DIR"
echo "Done! templates/ is populated."
