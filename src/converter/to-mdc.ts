import { parseFrontmatter } from '../utils/frontmatter.js';
import { getGlobsForPlugin, isAlwaysApply } from '../utils/glob-mapper.js';

export function convertToMdc(agentMd: string, pluginName: string): string {
  const { data, body } = parseFrontmatter(agentMd);

  // Extract description: prefer frontmatter, fall back to first paragraph
  const rawDesc =
    typeof data.description === 'string' && data.description.length > 0
      ? data.description
      : extractFirstParagraph(body);
  const description = truncateDescription(rawDesc);

  // Determine globs and alwaysApply based on plugin domain
  const globs = getGlobsForPlugin(pluginName);
  const alwaysApply = isAlwaysApply(pluginName);

  // Build .mdc frontmatter
  const fmLines: string[] = [];
  fmLines.push(`description: ${escapeYamlString(description)}`);
  if (globs.length > 0) {
    fmLines.push(`globs: ${JSON.stringify(globs)}`);
  }
  fmLines.push(`alwaysApply: ${alwaysApply}`);

  // Clean the body for Cursor rule format
  const ruleBody = cleanBody(body);

  return `---\n${fmLines.join('\n')}\n---\n\n${ruleBody}\n`;
}

function extractFirstParagraph(body: string): string {
  const trimmed = body.trim();
  const idx = trimmed.indexOf('\n\n');
  if (idx === -1) return trimmed.slice(0, 200);
  return trimmed.slice(0, idx).trim();
}

function truncateDescription(desc: string): string {
  // Take first sentence, max 200 chars
  const firstSentence = desc.split(/\.\s/)[0];
  const withPeriod = firstSentence.endsWith('.') ? firstSentence : firstSentence + '.';
  if (withPeriod.length <= 200) return withPeriod;
  return desc.slice(0, 197) + '...';
}

function cleanBody(body: string): string {
  return body
    // Remove "You are a..." persona intro (first paragraph if it starts that way)
    .replace(/^You are [\s\S]*?\n\n/, '')
    .trim();
}

function escapeYamlString(str: string): string {
  // If it contains special chars, wrap in quotes
  if (/[:#\[\]{}&*!|>'"%@`]/.test(str) || str.includes('\n')) {
    return JSON.stringify(str);
  }
  return str;
}
