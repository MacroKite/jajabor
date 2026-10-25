import Nav from '@/components/Nav';
import { PageTransition } from '@/components/Transitions';

// Placeholders for the loading.tsx files of pages that render on every request (they check the
// session or read the search). Next shows them the moment a link is clicked, then swaps in the page.
// Each one follows its page's layout, with the page's own heading, so the content fills in place.

type NavProps = React.ComponentProps<typeof Nav>;

const Block = ({ className = '' }: { className?: string }) =>
  <div aria-hidden="true" className={`rounded-[10px] bg-frame motion-safe:animate-pulse ${className}`} />;

const CARD = 'flex flex-col gap-6 rounded-[14px] border border-line p-5 tablet:p-8';
const H1 = 'm-0 text-[clamp(44px,10vw,160px)] leading-[0.9] font-bold tracking-[-0.055em]';
const HEADER = 'flex flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[5vw] pt-10 tablet:pt-16 desktop:pt-24';

// The real nav, plus a status message for screen readers.
export function SkeletonShell({ active, hideShare, children }: Pick<NavProps, 'active' | 'hideShare'> & { children: React.ReactNode }) {
  return (
    <PageTransition aria-busy="true">
      <Nav active={active} hideShare={hideShare} />
      <span role="status" className="sr-only">Loading…</span>
      {children}
    </PageTransition>
  );
}

// A form field: its label, then the input.
const Field = ({ tall = false }: { tall?: boolean }) => (
  <div className="flex flex-col gap-2">
    <Block className="h-4 w-28 rounded-md" />
    <Block className={tall ? 'h-[120px]' : 'h-[52px]'} />
  </div>
);

export function StoryCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Block className="aspect-[16/11]" />
      <Block className="h-6 w-4/5 rounded-md" />
      <Block className="h-4 w-1/2 rounded-md" />
    </div>
  );
}

export function DestinationCardSkeleton() {
  return (
    <div className="flex flex-col gap-3.5">
      <Block className="aspect-[4/3]" />
      <div className="flex flex-col gap-2">
        <Block className="h-7 w-1/2 rounded-md" />
        <Block className="h-4 w-1/3 rounded-md" />
      </div>
      <Block className="h-4 w-full rounded-md" />
      <Block className="h-4 w-3/4 rounded-md" />
    </div>
  );
}

// /account: the "About you" and password cards beside the list of your stories.
export function AccountSkeleton() {
  return (
    <SkeletonShell>
      <header className={HEADER}>
        <h1 className={H1}>Your <span className="mesh-word">profile</span></h1>
        <Block className="mb-2 h-5 w-52 rounded-md" />
      </header>
      <div className="grid gap-6 px-[5vw] pt-10 tablet:pt-14 desktop:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] desktop:items-start desktop:gap-8">
        <div className="flex flex-col gap-6">
          <section className={CARD}>
            <Block className="h-8 w-40 rounded-md" />
            <div className="flex items-center gap-5">
              <Block className="size-24 rounded-full" />
              <Block className="h-10 w-36 rounded-full" />
            </div>
            <div className="grid gap-4.5 tablet:grid-cols-2"><Field /><Field /></div>
            <Field tall />
            <Field />
          </section>
          <section className={CARD}>
            <Block className="h-8 w-36 rounded-md" />
            <Field />
          </section>
        </div>
        <section className={CARD}>
          <Block className="h-8 w-44 rounded-md" />
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-4">
              <Block className="aspect-[16/11] w-24 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Block className="h-5 w-4/5 rounded-md" />
                <Block className="h-4 w-1/2 rounded-md" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </SkeletonShell>
  );
}

// /travellers/<id>: photo, name and details, then their stories.
export function TravellerSkeleton() {
  return (
    <SkeletonShell>
      <header className="flex flex-col gap-6 px-[5vw] pt-10 tablet:flex-row tablet:items-end tablet:gap-8 tablet:pt-16 desktop:pt-24">
        <Block className="size-24 shrink-0 rounded-full tablet:size-32 desktop:size-40" />
        <div className="flex min-w-0 flex-1 flex-col gap-5 tablet:gap-8">
          <Block className="h-[clamp(40px,7vw,104px)] w-3/4 max-w-[640px]" />
          <Block className="h-5 w-64 rounded-md" />
        </div>
      </header>
      <section className="px-[5vw] pt-14 tablet:pt-20">
        <div className="border-b border-line pb-5"><Block className="h-10 w-60 rounded-md" /></div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 pt-8 tablet:grid-cols-2 desktop:grid-cols-3">
          {[0, 1, 2].map(i => <StoryCardSkeleton key={i} />)}
        </div>
      </section>
    </SkeletonShell>
  );
}

// /share and /stories/<id>/edit: the story form.
export function EditorSkeleton({ editing = false }: { editing?: boolean }) {
  const GRID = 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-5 gap-y-4';
  return (
    <SkeletonShell>
      <header className={HEADER}>
        <h1 className={H1}>{editing ? 'Edit your' : 'Share your'} <span className="mesh-word">story</span></h1>
      </header>
      <section className="flex flex-col gap-6 px-[5vw] pt-10 tablet:pt-16 desktop:pt-24">
        <div className={GRID}><Field /><Field /></div>
        <div className="flex flex-col gap-2">
          <Block className="h-4 w-24 rounded-md" />
          <Block className="h-[420px]" />
        </div>
        <div className={GRID}><Field /><Field /></div>
        <Block className="h-[94px] max-w-[520px]" />
        <Block className="h-[64px]" />
      </section>
    </SkeletonShell>
  );
}

// /search: the search box and a grid of destinations.
export function SearchSkeleton() {
  return (
    <SkeletonShell active="destinations">
      <header className="flex flex-col gap-8 px-[5vw] pt-10 tablet:gap-10 tablet:pt-16 desktop:pt-24">
        <h1 className={H1}>Search <span className="mesh-word">results</span></h1>
        <Block className="h-[62px] max-w-[760px] rounded-full tablet:h-[82px]" />
      </header>
      <div className="mx-[5vw] mt-12 border-b border-line pb-7 tablet:mt-16"><Block className="h-5 w-72 rounded-md" /></div>
      <section className="grid grid-cols-[repeat(auto-fill,minmax(max(300px,calc((100%_-_80px)_/_3)),1fr))] gap-x-6 gap-y-12 px-[5vw] pt-10 tablet:gap-x-10 desktop:gap-y-20">
        {[0, 1, 2].map(i => <DestinationCardSkeleton key={i} />)}
      </section>
    </SkeletonShell>
  );
}

// /login and /signup: the heading and the sign-in form.
export function AuthSkeleton({ mode }: { mode: 'login' | 'signup' }) {
  const signup = mode === 'signup';
  return (
    <SkeletonShell hideShare>
      <section className="flex flex-col items-center px-[5vw] pt-12 tablet:pt-20 desktop:pt-24">
        <h1 className="m-0 text-center text-[clamp(40px,7vw,96px)] leading-[0.95] font-bold tracking-[-0.05em]">
          {signup ? 'Join' : 'Welcome'} <span className="mesh-word">{signup ? 'Jajabor' : 'back'}</span>
        </h1>
        <p className="mt-4 mb-10 max-w-[420px] text-center text-[16px] text-muted tablet:mb-12 tablet:text-[18px]">
          {signup ? 'Create a free account to share your travel stories.' : 'Log in to share your travel stories.'}
        </p>
        <div className="flex w-full max-w-[440px] flex-col gap-6">
          <Block className="h-[54px] rounded-full" />
          <Block className="mx-auto h-4 w-28 rounded-md" />
          <div className="flex flex-col gap-4.5">
            {signup && <Field />}
            <Field />
            <Field />
            <Block className="mt-1 h-[56px] rounded-full" />
          </div>
        </div>
      </section>
    </SkeletonShell>
  );
}
