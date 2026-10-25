import { ViewTransition } from 'react';

// Page transitions, using React's <ViewTransition> and the browser's View Transitions API. Navigations
// run them on their own; browsers without the API (or readers who ask for reduced motion) get the
// plain page swap. The animations are in app/(frontend)/globals.css.

// The outer element of every page and loading skeleton. On navigation the old page fades out and the
// new one fades in; a skeleton fades into the page it stands in for the same way.
export function PageTransition({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div className="overflow-x-clip bg-paper" {...rest}>{children}</div>
    </ViewTransition>
  );
}

// A photo that also appears on the page its link opens: a card's photo and that guide's or story's
// hero share a name, so the photo grows into place instead of cutting. On other navigations it fades
// with its page. A name must be unique on a page, or the browser skips the transition. With no name
// the photo just fades with its page.
export function SharedPhoto({ name, children }: { name: string | null; children: React.ReactNode }) {
  if (!name) return children;
  return <ViewTransition name={name} share="photo-morph" enter="page-in" exit="page-out" default="none">{children}</ViewTransition>;
}

export const destinationPhoto = (id: string) => `destination-${id}`;
export const storyPhoto = (id: string) => `story-${id}`;
