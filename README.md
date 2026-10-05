# TRIP

A free, honest guide to travelling in Bangladesh, with stories written by travellers. A nonprofit, made in Dhaka.

Built with Next.js (App Router), Tailwind CSS and MongoDB (Mongoose). The original HTML design files are in [`design/`](design/).

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

## Layouts

Styling is Tailwind CSS v4 with three layouts, set in [`app/globals.css`](app/globals.css): **phone** is the default (no prefix), `tablet:` applies from 768px and `desktop:` from 1024px. Tailwind's other breakpoints (`sm:`, `md:`, `lg:`, …) are turned off. On phones the nav collapses into a full-screen menu.

## Data

- **Destinations** and their guides are in [`lib/data.ts`](lib/data.ts). They change rarely, so they stay in code: the pages are prerendered, and every edit is reviewed in git. The home page reads from the same list.
- **Destination photos** are on Cloudinary under `trip/places/` (copied from Wikimedia Commons, CC BY-SA; each image's original page is in its `source` context field). [`lib/images.ts`](lib/images.ts) builds the URLs: `photo('sajek-valley-01', 900)` gives a 900px-wide WebP/AVIF. To add a photo, upload it to `trip/places/` in the Cloudinary Media Library and use its name with `photo()`.
- **Stories** and **contact messages** are stored in MongoDB, in the `stories` and `messages` collections. The Mongoose models are in [`models/`](models/), the connection is in [`lib/mongodb.ts`](lib/mongodb.ts), and the queries are in [`lib/db.ts`](lib/db.ts). The home page features the newest published story.
- **Story photos** are stored on Cloudinary, in the `trip/stories` folder, named after the story id ([`lib/cloudinary.ts`](lib/cloudinary.ts)). Each story keeps the photo's `imageUrl` and `imagePublicId`. The browser shrinks each photo to at most 1600px wide before upload (usually 200–600 KB); the server checks it is a real JPG, PNG or WebP under 3 MB, then uploads it. Cloudinary serves it as WebP or AVIF where the browser supports it.
- New stories go live immediately. To hide one (in `mongosh` or MongoDB Compass):
  ```js
  db.stories.updateOne({ _id: '...' }, { $set: { status: 'rejected' } })
  ```
  The photo stays reachable at its Cloudinary URL; delete it in the Cloudinary Media Library (`trip/stories/<id>`) if it must go too.
- To read contact messages:
  ```js
  db.messages.find().sort({ createdAt: -1 })
  ```

## Accounts

Visitors can read everything without an account; **publishing a story needs one**. Sign-in uses [Better Auth](https://www.better-auth.com) ([`lib/auth.ts`](lib/auth.ts)) with Google or email and password, at `/login` and `/signup`.

- Users, sessions and linked accounts are stored in MongoDB, in the `user`, `session` and `account` collections. Passwords are hashed by Better Auth.
- Signing in with Google using the same email as an existing password account links the two.
- `/share` redirects to `/login` and back; `/api/stories` rejects requests without a session. Each new story stores its author's `userId`.
- Not set up yet: email verification and password reset (both need an email service such as Resend).

**Google setup:** in Google Cloud Console, create an OAuth client ID (Web application) and add `http://localhost:3000/api/auth/callback/google` and `https://<your-domain>/api/auth/callback/google` as authorized redirect URIs. While the OAuth consent screen is in "Testing", only listed test users can sign in; publish it before launch.

## Deploy to Vercel

1. Push this folder to a GitHub repository, then import it at [vercel.com/new](https://vercel.com/new). Vercel detects Next.js, so no settings are needed.
2. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas). Under **Network Access**, allow `0.0.0.0/0` (Vercel has no fixed IP addresses), and create a database user.
3. Create a free [Cloudinary](https://cloudinary.com) account.
4. In the Vercel project, under **Settings → Environment Variables**, set `MONGODB_URI` to the Atlas connection string (with `/trip` as the database name), `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` from the Cloudinary dashboard, and `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your site URL, e.g. `https://trip.org.bd`), `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.
5. Redeploy.
6. Optional: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://trip.org.bd`) once you have a custom domain. It is used in the sitemap and in share previews.

## Local development

```bash
npm install
cp .env.example .env.local   # points at a local MongoDB: mongodb://127.0.0.1:27017/trip
npm run dev
```

Without `MONGODB_URI`, the site shows no stories, and publishing a story or sending a message returns a friendly error. Publishing a story also needs the three `CLOUDINARY_*` variables.
