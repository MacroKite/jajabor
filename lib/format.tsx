// Light formatting for text typed into the CMS.

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

// The text without **bold** markers, for excerpts.
export const plain = (t: string) => t.replace(/\*\*(.+?)\*\*/g, '$1');

export type TextBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'ul'; items: { text: string; sub: string[] }[] };

// Splits text into paragraphs (separated by an empty line), subheadings ("## " at the start) and
// bullet lists: lines starting with "- " are bullets, and indented "- " lines are bullets inside the one above.
export function textBlocks(t: string): TextBlock[] {
  return t.split(/\n\s*\n/).map(c => c.trim()).filter(Boolean).map((chunk): TextBlock => {
    const lines = chunk.split('\n').filter(l => l.trim());
    if (/^##\s/.test(lines[0])) return { kind: 'h', text: lines.map(l => l.trim()).join(' ').replace(/^##\s+/, '') };
    if (!/^-\s/.test(lines[0])) return { kind: 'p', text: lines.map(l => l.trim()).join(' ') };
    const items: { text: string; sub: string[] }[] = [];
    for (const line of lines) {
      const m = line.match(/^(\s*)-\s+(.*)$/);
      const last = items[items.length - 1];
      if (m && m[1] && last) last.sub.push(m[2]);
      else if (m) items.push({ text: m[2], sub: [] });
      else if (last) last.text += ' ' + line.trim();
    }
    return { kind: 'ul', items };
  });
}
