# JAJABOR

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

- **Destinations, the home page text, photo grid, FAQ, the About page and the contact details** are edited in the CMS (below). The site reads them through [`lib/content.ts`](lib/content.ts).
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

## CMS (Payload)

Content is edited at **`/admin`** with [Payload CMS](https://payloadcms.com), which runs inside this app and stores its data in the same MongoDB database.

- **First time:** open `/admin` and create the first account; it is always an **admin**. Admins add volunteers under *Settings → CMS users* as **editors**.
- **Editors** can edit destinations, photos, the home page, FAQ and About page. Only **admins** can delete destinations or photos, and manage CMS users. CMS accounts are separate from the site's reader accounts.
- **What's editable:** *Destinations* (drag rows to reorder), *Photos* (uploaded to Cloudinary under `trip/media/`, with a credit field for licences), and the *Home page*, *FAQ* and *About page & contact* (contact details and social links also appear in the footer).
- **Changes go live in seconds**, with no redeploy: saving refreshes the affected pages. New destinations get their page on first visit.
- **Code:** collections and globals are in [`cms/`](cms/), the config in [`payload.config.ts`](payload.config.ts). After changing them, run `npm run generate:types` (and `npm run generate:importmap` if you add admin components).
- The site and the CMS have separate root layouts: the site is in `app/(frontend)`, the admin in `app/(payload)`. Unknown URLs use `app/global-not-found.tsx`.
- `scripts/seed-cms.ts` copied the original hard-coded content into the CMS (`npx payload run scripts/seed-cms.ts`; it does nothing once destinations exist).

## Accounts

Visitors can read everything without an account; **publishing a story needs one**. Sign-in uses [Better Auth](https://www.better-auth.com) ([`lib/auth.ts`](lib/auth.ts)) with Google or email and password, at `/login` and `/signup`.

- Users, sessions and linked accounts are stored in MongoDB, in the `user`, `session` and `account` collections. Passwords are hashed by Better Auth.
- Signing in with Google using the same email as an existing password account links the two.
- `/share` redirects to `/login` and back; `/api/stories` rejects requests without a session. Each new story stores its author's `userId` and is published under the name on their account (there is no name field in the form).
- Authors can **edit** (`/stories/<id>/edit`, `PATCH /api/stories/<id>`) and **delete** (`DELETE /api/stories/<id>`) their own stories; the buttons appear on the story page for the author only. Deleting also removes the photo from Cloudinary. Starter stories have no author, so they can't be changed from the site.
- **Profiles.** `/account` (logged in) edits name, photo, hometown and a short bio, changes the password (email accounts), and lists your stories. `/travellers/<id>` is the public profile: photo, name, hometown, bio and stories, never the email. Hometown and bio are extra Better Auth user fields; a hook in [`lib/auth.ts`](lib/auth.ts) trims them and only accepts photos uploaded through `/api/account/avatar` (Cloudinary, `trip/avatars/<user id>`, face-cropped) or from Google.
- Stories show their author's **current** name and photo, so renaming an account updates every story. The author's name on a story page links to their profile.
- Not set up yet: email verification and password reset (both need an email service such as Resend).

**Google setup:** in Google Cloud Console, create an OAuth client ID (Web application) and add `http://localhost:3000/api/auth/callback/google` and `https://<your-domain>/api/auth/callback/google` as authorized redirect URIs. While the OAuth consent screen is in "Testing", only listed test users can sign in; publish it before launch.

## Deploy to Vercel

1. Push this folder to a GitHub repository, then import it at [vercel.com/new](https://vercel.com/new). Vercel detects Next.js, so no settings are needed.
2. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas). Under **Network Access**, allow `0.0.0.0/0` (Vercel has no fixed IP addresses), and create a database user.
3. Create a free [Cloudinary](https://cloudinary.com) account.
4. In the Vercel project, under **Settings → Environment Variables**, set `MONGODB_URI` to the Atlas connection string (with `/trip` as the database name), `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` from the Cloudinary dashboard, and `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your site URL, e.g. `https://trip.org.bd`), `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` and `PAYLOAD_SECRET`.
5. Redeploy.
6. Optional: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://trip.org.bd`) once you have a custom domain. It is used in the sitemap and in share previews.

## Local development

```bash
npm install
cp .env.example .env.local   # points at a local MongoDB: mongodb://127.0.0.1:27017/trip
npm run dev
```

Without `MONGODB_URI`, the site shows no stories, and publishing a story or sending a message returns a friendly error. Publishing a story also needs the three `CLOUDINARY_*` variables.
