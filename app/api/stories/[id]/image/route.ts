import { getStoryImage } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const img = await getStoryImage((await params).id);
  if (!img) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(img.data), {
    headers: {
      'Content-Type': img.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
