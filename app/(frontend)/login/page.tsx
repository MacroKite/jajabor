import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import AuthForm from '@/components/AuthForm';
import { getSession, safeNext } from '@/lib/auth';

export const metadata: Metadata = { title: 'Log in', robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next: n, error } = await searchParams;
  const next = safeNext(n);
  if (await getSession()) redirect(next);

  return (
    <div className="overflow-x-clip bg-white">
      <Nav />
      <section className="flex flex-col items-center px-[5vw] pt-12 tablet:pt-20 desktop:pt-24">
        <h1 className="m-0 text-center text-[clamp(40px,7vw,96px)] leading-[0.95] font-bold tracking-[-0.05em]">Welcome <span className="mesh-word">back</span></h1>
        <p className="mt-4 mb-10 max-w-[420px] text-center text-[16px] text-muted tablet:mb-12 tablet:text-[18px]">Log in to share your travel stories.</p>
        <AuthForm mode="login" next={next} initialError={error ? 'Google sign-in didn’t work. Please try again.' : undefined} />
      </section>
    </div>
  );
}
