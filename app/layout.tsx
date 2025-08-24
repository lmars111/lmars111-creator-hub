import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'CreatorChat Hub - Connect with Your Favorite Creators',
  description: 'The ultimate platform for creators and fans to connect through personalized chat experiences, exclusive content, and direct interactions.',
  keywords: 'creator platform, fan chat, exclusive content, creator economy, social media',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}