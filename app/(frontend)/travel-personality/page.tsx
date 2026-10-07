import type { Metadata } from 'next';
import { getDestinations } from '@/lib/content';
import PersonalityTest from './PersonalityTest';

export const metadata: Metadata = {
  title: 'ভ্রমণ ব্যক্তিত্ব পরীক্ষা',
  description: '১০টি প্রশ্নের উত্তর দিয়ে জেনে নিন আপনি কোন ধরনের পর্যটক, আর বাংলাদেশের কোন জায়গাগুলো আপনার জন্য সেরা।',
};

export default async function Page() {
  return <PersonalityTest dests={await getDestinations()} />;
}
