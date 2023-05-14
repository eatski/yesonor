export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

import 'sanitize.css';
import '@/styles/base.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
