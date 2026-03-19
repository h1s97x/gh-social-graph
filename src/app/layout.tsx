import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'GitHub Social Graph | 探索你的开发者社交宇宙',
    template: '%s | GitHub Social Graph',
  },
  description:
    '可视化 GitHub 开发者之间的关系网络，发现潜在合作者，探索代码宇宙的星辰大海。分析共同关注者、协作仓库，生成力导向图谱。',
  keywords: [
    'GitHub',
    'Social Graph',
    '开发者社交网络',
    'Social Network',
    '数据可视化',
    '力导向图',
    'Force-directed Graph',
    '开源社区',
    '协作分析',
    'D3.js',
  ],
  authors: [{ name: 'GitHub Social Graph Team', url: 'https://github.com' }],
  generator: 'Next.js',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'GitHub Social Graph | 探索你的开发者社交宇宙',
    description:
      '可视化 GitHub 开发者之间的关系网络，发现潜在合作者，探索代码宇宙的星辰大海。',
    url: 'https://github-social-graph.vercel.app',
    siteName: 'GitHub Social Graph',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GitHub Social Graph - 探索你的开发者社交宇宙',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Social Graph | 探索你的开发者社交宇宙',
    description:
      '可视化 GitHub 开发者之间的关系网络，发现潜在合作者，探索代码宇宙的星辰大海。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en" className="dark">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
