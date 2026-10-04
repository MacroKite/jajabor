import { listStories } from '@/lib/db';
import HomeView from './HomeView';

export const revalidate = 60;

export default async function Page() {
  return <HomeView stories={await listStories(5)} />;
}
