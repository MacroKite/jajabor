import Footer from '@/components/Footer';
import { getAbout } from '@/lib/content';

// Hides images that fail to load (hot-linked photos can disappear).
const hideBroken = `document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG')t.style.visibility='hidden'},true);`;

// The <html> shell shared by the site layout and the global 404 page. The footer shows the
// contact details and social links from the CMS (About page & contact).
export default async function SiteDocument({ children }: { children: React.ReactNode }) {
  const { contact } = await getAbout();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Only the Bangla digits ০–৯ from Noto Sans Bengali: Hind Siliguri's regular weights draw a broken "১". */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&text=%E0%A7%A6%E0%A7%A7%E0%A7%A8%E0%A7%A9%E0%A7%AA%E0%A7%AB%E0%A7%AC%E0%A7%AD%E0%A7%AE%E0%A7%AF&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: hideBroken }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <Footer contact={contact} />
      </body>
    </html>
  );
}
