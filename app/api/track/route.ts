import { recordView } from '@/lib/analytics';

// Page views sent by components/PageViewTracker. Always answers 204, so a failure never shows on the site.
export async function POST(req: Request) {
  try {
    const f = await req.json();
    const path = typeof f.path === 'string' && f.path.startsWith('/') ? f.path.slice(0, 200) : '';
    if (path) {
      let referrer: string | null = null;
      try { referrer = f.referrer ? new URL(f.referrer).hostname.replace(/^www\./, '') : null; } catch {}
      const h = req.headers;
      await recordView({
        path,
        referrer,
        ip: h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || '',
        ua: h.get('user-agent') || '',
        country: h.get('x-vercel-ip-country') || h.get('cf-ipcountry') || null,
      });
    }
  } catch (e) {
    console.error('recordView failed', e);
  }
  return new Response(null, { status: 204 });
}
