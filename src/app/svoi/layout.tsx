import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Кафе «СВОИ» Нячанг | Cafe SVOI Nha Trang — Кофе, Домашняя Кухня, События',
  description: 'Официальный сайт Кафе «СВОИ» в Нячанге (58 Cao Văn Bé, 650000). Спешелти кофе, домашняя кухня, свежая выпечка, чайные церемонии и душевные события.',
  metadataBase: new URL('https://svoi.gbpilot.top'),
  alternates: {
    canonical: 'https://svoi.gbpilot.top',
  },
  openGraph: {
    title: 'Кафе «СВОИ» в Нячанге | SVOI Cafe Nha Trang',
    description: 'Уютное кафе домашней кухни, спешелти кофе и событий в Нячанге (58 Cao Văn Bé). Там, где встречаются люди и смыслы.',
    url: 'https://svoi.gbpilot.top',
    siteName: 'Кафе СВОИ Нячанг',
    images: [
      {
        url: '/images/svoi/post_tea.png',
        width: 800,
        height: 1000,
        alt: 'Кафе СВОИ Нячанг',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
};

export default function SvoiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
