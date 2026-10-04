# TRIP

A free, honest guide to travelling in Bangladesh, with stories written by travellers. A nonprofit, made in Dhaka.

Built with Next.js (App Router) and Postgres (Neon). The original HTML design files are in [`design/`](design/).

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home |
| `/destinations` (`?filter=popular\|gem`) | All destinations |
| `/destinations/<id>` | Destination guide, e.g. `/destinations/sajek` |
| `/stories` (`?place=<id>`) | All stories, with a place filter |
| `/stories/<id>` | One story, with share buttons |
| `/share` (`?place=<id>`) | Write a story |
| `/about` | About us and the contact form |

The old prototype URLs (`TRIP.dc.html`, `Destination.dc.html?id=…`, `Stories.dc.html?story=…` and so on) redirect to these.

## Data

- **Destinations** and their guides are in [`lib/data.ts`](lib/data.ts).
- **Stories**, their **photos** and **contact messages** are stored in Postgres. [`lib/db.ts`](lib/db.ts) creates the tables (`stories`, `story_images`, `messages`) on first use and adds the six starter stories if there are none, so there is no separate migration step.
- The browser shrinks each photo to at most 1600px wide before upload (usually 200–600 KB). The server checks it is a real JPG, PNG or WebP under 3 MB.
- New stories go live immediately. To hide one:
  ```sql
  update stories set status = 'rejected' where id = '...';
  ```
- To read contact messages:
  ```sql
  select * from messages order by created_at desc;
  ```

## Deploy to Vercel

1. Push this folder to a GitHub repository, then import it at [vercel.com/new](https://vercel.com/new). Vercel detects Next.js, so no settings are needed. If the repository contains the parent folder, set **Root Directory** to `TRIP-website`.
2. In the Vercel project, go to **Storage → Create Database → Neon (Postgres)** and connect it to the project. This sets `DATABASE_URL`.
3. Redeploy. The first request creates the tables and the starter stories.
4. Optional: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://trip.org.bd`) once you have a custom domain. It is used in the sitemap and in share previews.

## Local development

```bash
npm install
npm run dev
```

Without `DATABASE_URL`, the site runs read-only on the starter stories, and publishing a story or sending a message returns a friendly error. To use a real database locally, run `npx vercel env pull .env.local`, or copy `.env.example` to `.env.local` and paste your Neon connection string.
