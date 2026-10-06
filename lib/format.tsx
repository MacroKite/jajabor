// Light formatting for text typed into the CMS and stories written with the story editor.

// Renders **double-starred** words in bold.
export const bold = (t: string) => t.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <b key={i} className="font-bold text-ink">{part}</b> : part));

// Phone numbers typed in one field, separated by commas, each with its tel: link. Bangladeshi
// mobile numbers, typed as 01XXXXXXXXX or +8801XXXXXXXXX, are shown as +880 1XXX-XXXXXX.
export const phones = (t: string) =>
  t.split(',').map(p => p.trim()).filter(Boolean).map(p => {
    const bd = p.replace(/\D/g, '').match(/^(?:880)?0?(1\d{9})$/);
    return bd
      ? { text: `+880 ${bd[1].slice(0, 4)}-${bd[1].slice(4)}`, href: `tel:+880${bd[1]}` }
      : { text: p, href: 'tel:' + p.replace(/[^+\d]/g, '') };
  });

// "bn" when the text is written in Bangla, for the lang attribute; globals.css gives Bangla
// headlines more line height.
export const bnLang = (t: string) => (/[\u0980-\u09FF]/.test(t) ? 'bn' : undefined);

// The text without **bold** markers, for excerpts.
export const plain = (t: string) => t.replace(/\*\*(.+?)\*\*/g, '$1');

export type ListItem = { text: string; sub: string[] };
export type TextBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h'; level: 2 | 3; text: string }
  | { kind: 'ul' | 'ol'; items: ListItem[] };

const LIST_LINE = /^(\s*)(?:-|\d+[.)])\s+(.*)$/;

// Splits text into blocks, separated by an empty line:
// - "## " starts a heading and "### " a smaller one (shown as H1 and H2 in the story editor);
// - lines starting with "- " make a bulleted list, "1. " a numbered one; an indented line is a
//   point inside the one above;
// - anything else is a paragraph. **Double stars** make text bold (see `bold`).
export function textBlocks(t: string): TextBlock[] {
  return t.split(/\n\s*\n/).map(c => c.trim()).filter(Boolean).map((chunk): TextBlock => {
    const lines = chunk.split('\n').filter(l => l.trim());
    const join = () => lines.map(l => l.trim()).join(' ');
    const h = lines[0].match(/^(#{2,3})\s/);
    if (h) return { kind: 'h', level: h[1].length as 2 | 3, text: join().replace(/^#{2,3}\s+/, '') };
    const kind = /^-\s/.test(lines[0]) ? 'ul' : /^\d+[.)]\s/.test(lines[0]) ? 'ol' : null;
    if (!kind) return { kind: 'p', text: join() };
    const items: ListItem[] = [];
    for (const line of lines) {
      const m = line.match(LIST_LINE);
      const last = items[items.length - 1];
      if (m && m[1] && last) last.sub.push(m[2]);
      else if (m) items.push({ text: m[2], sub: [] });
      else if (last) last.text += ' ' + line.trim();
    }
    return { kind, items };
  });
}

// The words a story counts towards its minimum, ignoring the formatting marks.
export const wordCount = (t: string) =>
  (plain(t).replace(/^\s*(?:#{2,3}|-|\d+[.)])\s+/gm, '').match(/\S+/g) || []).length;
