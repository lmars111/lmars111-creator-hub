import './globals.css'

export const metadata = {
  title: 'Creator Hub',
  description: 'A creator management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}