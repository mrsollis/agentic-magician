import YAML from 'yaml';

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

export function parseFrontmatter(content: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = content.match(FRONTMATTER_RE);
  if (!match) {
    return { data: {}, body: content };
  }
  try {
    const data = YAML.parse(match[1]) as Record<string, unknown>;
    return { data: data ?? {}, body: match[2] };
  } catch {
    return { data: {}, body: content };
  }
}

export function serializeFrontmatter(
  data: Record<string, unknown>,
  body: string,
): string {
  const yaml = YAML.stringify(data, { lineWidth: 0 }).trimEnd();
  return `---\n${yaml}\n---\n\n${body}`;
}
