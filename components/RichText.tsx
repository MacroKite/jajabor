import { bold, textBlocks } from '@/lib/format';

// Body text for guides and stories: paragraphs, "## " subheadings, bullet lists and **bold**.
export const P = 'm-0 text-[17px] tablet:text-[19px] desktop:text-[clamp(20px,1.6vw,23px)] leading-[1.7] text-pretty text-[#2a2a2a]';
const LI = 'relative pl-6 before:absolute before:left-0 before:top-[0.75em] before:size-[7px] before:rounded-full before:bg-ink';

export default function RichText({ text }: { text: string }) {
  return textBlocks(text).map((b, i) =>
    b.kind === 'p' ? <p key={i} className={P}>{bold(b.text)}</p>
    : b.kind === 'h' ? <h2 key={i} className="m-0 mt-[0.6em] text-[clamp(24px,2.4vw,36px)] leading-tight font-bold tracking-[-0.03em]">{b.text}</h2>
    : (
      <ul key={i} className="m-0 flex list-none flex-col gap-4 p-0">
        {b.items.map((it, j) => (
          <li key={j} className={`${P} ${LI}`}>
            {bold(it.text)}
            {it.sub.length > 0 && (
              <ul className="mt-3 flex list-none flex-col gap-3 p-0">
                {it.sub.map((t, k) => <li key={k} className={`${LI} before:border-[1.5px] before:border-ink before:bg-transparent`}>{bold(t)}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ul>
    ),
  );
}
