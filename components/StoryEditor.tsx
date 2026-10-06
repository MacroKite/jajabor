'use client';

import { EditorContent, useEditor, useEditorState, type Editor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import { textBlocks } from '@/lib/format';

// The story editor on the Share and Edit pages: formatted as you type, with a small toolbar.
// Stories are saved as the plain text format RichText shows (see textBlocks in lib/format):
// "## " heading (H1 in the toolbar), "### " smaller heading (H2), "- " and "1. " lists, **bold**.

// ---- Saved text → editor document ----

// split() with a capture group puts the bold parts at odd positions.
const inline = (t: string): JSONContent[] =>
  t.split(/\*\*(.+?)\*\*/g).flatMap((part, i): JSONContent[] =>
    !part ? [] : i % 2 ? [{ type: 'text', text: part, marks: [{ type: 'bold' }] }] : [{ type: 'text', text: part }]);

const para = (t: string): JSONContent => ({ type: 'paragraph', content: t ? inline(t) : undefined });

export function toDoc(text: string): JSONContent {
  const content = textBlocks(text).map((b): JSONContent => {
    if (b.kind === 'p') return para(b.text);
    if (b.kind === 'h') return { type: 'heading', attrs: { level: b.level }, content: inline(b.text) };
    const type = b.kind === 'ul' ? 'bulletList' : 'orderedList';
    return {
      type,
      content: b.items.map(it => ({
        type: 'listItem',
        content: [para(it.text), ...(it.sub.length ? [{ type, content: it.sub.map(s => ({ type: 'listItem', content: [para(s)] })) }] : [])],
      })),
    };
  });
  return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] };
}

// ---- Editor document → saved text ----

// Bold text keeps its ** marks. Neighbouring pieces with the same weight are joined first, and
// spaces at the edges of bold text go outside the marks ("**word** next", not "**word **next").
function toInline(nodes: JSONContent[] = []): string {
  const runs: { bold: boolean; text: string }[] = [];
  for (const n of nodes) {
    const text = (n.text ?? '').replace(/\n/g, ' ');
    const isBold = !!n.marks?.some(m => m.type === 'bold');
    const last = runs[runs.length - 1];
    if (last && last.bold === isBold) last.text += text;
    else runs.push({ bold: isBold, text });
  }
  return runs.map(r => {
    if (!r.bold) return r.text;
    const [, lead, core, trail] = r.text.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
    return core ? lead + '**' + core + '**' + trail : r.text;
  }).join('').trim();
}

// One line per point. Our format has one level of points inside points; deeper ones join it.
function listLines(list: JSONContent, depth: number): string[] {
  return (list.content ?? []).flatMap((item, i) => {
    const mark = list.type === 'orderedList' ? `${i + 1}. ` : '- ';
    const parts = item.content ?? [];
    const text = parts.filter(c => c.type !== 'bulletList' && c.type !== 'orderedList').map(c => toInline(c.content)).filter(Boolean).join(' ');
    const nested = parts.filter(c => c.type === 'bulletList' || c.type === 'orderedList').flatMap(c => listLines(c, depth + 1));
    return [(depth ? '  ' : '') + mark + text, ...nested];
  });
}

export function toText(doc: JSONContent): string {
  return (doc.content ?? []).map(b => {
    if (b.type === 'heading') return '#'.repeat(b.attrs?.level === 3 ? 3 : 2) + ' ' + toInline(b.content);
    if (b.type === 'bulletList' || b.type === 'orderedList') return listLines(b, 0).join('\n');
    return toInline(b.content);
  }).filter(s => s.replace(/^#+\s*/, '').trim()).join('\n\n');
}

// ---- Toolbar ----

const ICONS = {
  bold: <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />,
  ul: <><circle cx="5" cy="7" r="1.2" fill="currentColor" stroke="none" /><circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="5" cy="17" r="1.2" fill="currentColor" stroke="none" /><path d="M9.5 7H20M9.5 12H20M9.5 17H20" /></>,
  ol: <><path d="M10 7h10M10 12h10M10 17h10" /><text x="2.5" y="9" fontSize="6.5" fill="currentColor" stroke="none" fontWeight="700">1</text><text x="2.5" y="14.5" fontSize="6.5" fill="currentColor" stroke="none" fontWeight="700">2</text><text x="2.5" y="20" fontSize="6.5" fill="currentColor" stroke="none" fontWeight="700">3</text></>,
  undo: <path d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />,
  redo: <path d="m15 14 5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />,
};

function Btn({ label, on, disabled, onClick, children }: { label: string; on?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={on}
      disabled={disabled}
      // Keep the cursor in the text while clicking the toolbar.
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      className={`flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md px-2 text-[14px] font-bold transition-colors disabled:cursor-default disabled:opacity-30 ${on ? 'bg-ink text-white' : 'text-ink hover:bg-[#ececec]'}`}
    >
      {children}
    </button>
  );
}

const Icon = ({ d }: { d: React.ReactNode }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const SEP = <span aria-hidden="true" className="mx-1 h-5 w-px bg-[#dcdcdc]" />;

function Toolbar({ editor }: { editor: Editor }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h1: e.isActive('heading', { level: 2 }),
      h2: e.isActive('heading', { level: 3 }),
      bold: e.isActive('bold'),
      ul: e.isActive('bulletList'),
      ol: e.isActive('orderedList'),
      undo: e.can().undo(),
      redo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();
  return (
    <div role="toolbar" aria-label="Formatting" className="sticky top-[72px] z-10 flex flex-wrap items-center gap-0.5 rounded-t-[10px] border-b border-[#e2e2e2] bg-[#fafafa] px-2 py-1.5 tablet:top-[88px]">
      <Btn label="Normal text" on={!s.h1 && !s.h2 && !s.ul && !s.ol} onClick={() => c().setParagraph().run()}><span className="px-1 font-medium">Text</span></Btn>
      <Btn label="Heading (H1)" on={s.h1} onClick={() => c().toggleHeading({ level: 2 }).run()}>H1</Btn>
      <Btn label="Smaller heading (H2)" on={s.h2} onClick={() => c().toggleHeading({ level: 3 }).run()}>H2</Btn>
      {SEP}
      <Btn label="Bold (Ctrl+B)" on={s.bold} onClick={() => c().toggleBold().run()}><Icon d={ICONS.bold} /></Btn>
      {SEP}
      <Btn label="Bulleted list" on={s.ul} onClick={() => c().toggleBulletList().run()}><Icon d={ICONS.ul} /></Btn>
      <Btn label="Numbered list" on={s.ol} onClick={() => c().toggleOrderedList().run()}><Icon d={ICONS.ol} /></Btn>
      {SEP}
      <Btn label="Undo (Ctrl+Z)" disabled={!s.undo} onClick={() => c().undo().run()}><Icon d={ICONS.undo} /></Btn>
      <Btn label="Redo (Ctrl+Shift+Z)" disabled={!s.redo} onClick={() => c().redo().run()}><Icon d={ICONS.redo} /></Btn>
    </div>
  );
}

// ---- Editor ----

export default function StoryEditor({ value, onChange, placeholder, labelledBy }: { value: string; onChange: (text: string) => void; placeholder: string; labelledBy: string }) {
  const editor = useEditor({
    // Only the formatting stories can show; pasted content keeps just these.
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        italic: false, strike: false, underline: false, code: false, codeBlock: false,
        blockquote: false, horizontalRule: false, link: false, hardBreak: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: toDoc(value),
    immediatelyRender: false,
    editorProps: { attributes: { class: 'story-editor', 'aria-labelledby': labelledBy, 'aria-multiline': 'true', role: 'textbox' } },
    onUpdate: ({ editor: e }) => onChange(toText(e.getJSON())),
  });

  return (
    <div className="rounded-[10px] border border-[#e2e2e2] bg-white focus-within:border-bd-green focus-within:outline focus-within:outline-1 focus-within:outline-bd-green">
      {editor ? <Toolbar editor={editor} /> : <div className="h-12 rounded-t-[10px] border-b border-[#e2e2e2] bg-[#fafafa]" />}
      <EditorContent editor={editor} className="min-h-[320px] cursor-text px-5 py-4.5" onClick={() => editor?.commands.focus()} />
    </div>
  );
}
