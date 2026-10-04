import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { SEED, type Story } from './data';

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql: NeonQueryFunction<false, false> | null = url ? neon(url) : null;

export const hasDatabase = !!sql;

// Creates the tables on first use and seeds the starter stories when empty,
// so a fresh deploy works without a separate migration step.
let ready: Promise<void> | null = null;
function init(db: NeonQueryFunction<false, false>) {
  ready ??= (async () => {
    await db`create table if not exists stories (
      id         text primary key,
      place      text not null,
      title      text not null,
      body       text not null,
      name       text not null,
      hometown   text not null default 'Bangladesh',
      date       date not null default current_date,
      has_image  boolean not null default false,
      status     text not null default 'published' check (status in ('pending', 'published', 'rejected')),
      created_at timestamptz not null default now()
    )`;
    await db`alter table stories add column if not exists has_image boolean not null default false`;
    await db`create index if not exists stories_date_idx on stories (date desc, created_at desc)`;
    await db`create table if not exists story_images (
      story_id text primary key references stories(id) on delete cascade,
      mime     text not null,
      data     bytea not null
    )`;
    await db`create table if not exists messages (
      id         bigint generated always as identity primary key,
      name       text not null,
      email      text not null,
      message    text not null,
      created_at timestamptz not null default now()
    )`;
    const [{ n }] = await db`select count(*)::int as n from stories`;
    if (n === 0) {
      for (const s of SEED) {
        await db`insert into stories (id, place, title, body, name, hometown, date)
          values (${s.id}, ${s.place}, ${s.title}, ${s.text}, ${s.name}, ${s.from}, ${s.date})
          on conflict (id) do nothing`;
      }
    }
  })().catch(e => { ready = null; throw e; });
  return ready;
}

type Row = Record<string, string | boolean>;
const toStory = (r: Row): Story => ({
  id: r.id as string, place: r.place as string, title: r.title as string, text: r.body as string,
  name: r.name as string, from: r.hometown as string, date: r.date as string,
  image: r.has_image ? `/api/stories/${encodeURIComponent(r.id as string)}/image` : undefined,
});

const byDate = (a: Story, b: Story) => b.date.localeCompare(a.date);

export async function listStories(limit = 1000): Promise<Story[]> {
  if (!sql) return [...SEED].sort(byDate).slice(0, limit);
  await init(sql);
  const rows = await sql`select id, place, title, body, name, hometown, has_image, to_char(date, 'YYYY-MM-DD') as date
    from stories where status = 'published' order by date desc, created_at desc limit ${limit}`;
  return (rows as Row[]).map(toStory);
}

export async function getStory(id: string): Promise<Story | null> {
  if (!sql) return SEED.find(s => s.id === id) ?? null;
  await init(sql);
  const rows = await sql`select id, place, title, body, name, hometown, has_image, to_char(date, 'YYYY-MM-DD') as date
    from stories where status = 'published' and id = ${id}`;
  return rows.length ? toStory(rows[0] as Row) : null;
}

export async function getStoryImage(id: string): Promise<{ mime: string; data: Buffer } | null> {
  if (!sql) return null;
  await init(sql);
  const rows = await sql`select i.mime, encode(i.data, 'base64') as b64
    from story_images i join stories s on s.id = i.story_id
    where i.story_id = ${id} and s.status = 'published'`;
  if (!rows.length) return null;
  return { mime: rows[0].mime as string, data: Buffer.from(rows[0].b64 as string, 'base64') };
}

export async function insertStory(s: Story, image: { mime: string; base64: string }): Promise<void> {
  if (!sql) throw new Error('DATABASE_URL is not set');
  await init(sql);
  // One HTTP transaction, so a story never goes live without its photo.
  await sql.transaction([
    sql`insert into stories (id, place, title, body, name, hometown, date, has_image)
      values (${s.id}, ${s.place}, ${s.title}, ${s.text}, ${s.name}, ${s.from}, ${s.date}, true)`,
    sql`insert into story_images (story_id, mime, data) values (${s.id}, ${image.mime}, decode(${image.base64}, 'base64'))`,
  ]);
}

export async function insertMessage(m: { name: string; email: string; message: string }): Promise<void> {
  if (!sql) throw new Error('DATABASE_URL is not set');
  await init(sql);
  await sql`insert into messages (name, email, message) values (${m.name}, ${m.email}, ${m.message})`;
}
