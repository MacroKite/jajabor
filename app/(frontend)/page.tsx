import { listStories } from '@/lib/db';
import { getDestinations, getFaq, getHome } from '@/lib/content';
import HomeView from './HomeView';

export const revalidate = 60;

export default async function Page() {
  const [stories, dests, home, faqs] = await Promise.all([listStories(5), getDestinations(), getHome(), getFaq()]);
  return <HomeView stories={stories} dests={dests} home={home} faqs={faqs} />;
}
