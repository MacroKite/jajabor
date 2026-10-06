import { bold, textBlocks, type ListItem } from '@/lib/format';

// Body text for guides and stories: paragraphs, "## " and "### " headings, bulleted and numbered
// lists and **bold** (see textBlocks).
export const P = 'm-0 text-[17px] tablet:text-[19px] desktop:text-[clamp(20px,1.6vw,23px)] leading-[1.7] text-pretty text-[#2a2a2a]';
const BULLET = 'relative pl-6 before:absolute before:left-0 before:top-[0.75em] before:size-[7px] before:rounded-full before:bg-ink';
const H2 = 'm-0 mt-[0.6em] text-[clamp(24px,2.4vw,36px)] leading-tight font-bold tracking-[-0.03em]';
const H3 = 'm-0 mt-[0.4em] text-[clamp(20px,1.8vw,27px)] leading-tight font-bold tracking-[-0.02em]';

function List({ kind, items }: { kind: 'ul' | 'ol'; items: ListItem[] }) {
  const Tag = kind;
  // Numbered lists keep the browser's numbers; bulleted ones draw their own dots.
  const ITEM = kind === 'ol' ? `${P} ml-6 list-decimal pl-1.5 marker:font-bold` : `${P} ${BULLET}`;
  const SUB = kind === 'ol' ? 'ml-6 list-[lower-alpha] pl-1.5' : `${BULLET} before:border-[1.5px] before:border-ink before:bg-transparent`;
  return (
    <Tag className="m-0 flex list-none flex-col gap-4 p-0">
      {items.map((it, j) => (
        <li key={j} className={ITEM}>
          {bold(it.text)}
          {it.sub.length > 0 && (
            <Tag className="mt-3 flex list-none flex-col gap-3 p-0">
              {it.sub.map((t, k) => <li key={k} className={SUB}>{bold(t)}</li>)}
            </Tag>
          )}
        </li>
      ))}
    </Tag>
  );
}

export default function RichText({ text }: { text: string }) {
  return textBlocks(text).map((b, i) =>
    b.kind === 'p' ? <p key={i} className={P}>{bold(b.text)}</p>
    : b.kind === 'h' ? (b.level === 2 ? <h2 key={i} className={H2}>{b.text}</h2> : <h3 key={i} className={H3}>{b.text}</h3>)
    : <List key={i} kind={b.kind} items={b.items} />,
  );
}
