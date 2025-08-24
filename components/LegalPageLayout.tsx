import Head from 'next/head'
import Link from 'next/link'

interface LegalPageLayoutProps {
  title: string
  children: React.ReactNode
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title} - CreatorChat Hub</title>
        <meta name="description" content={`${title} for CreatorChat Hub platform`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '1rem 2rem', borderBottom: '1px solid #eee' }}>
          <Link href="/" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
            ← Back to CreatorChat Hub
          </Link>
        </header>
        <main style={{ flex: 1, padding: '2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          <h1 style={{ marginBottom: '2rem', color: '#333' }}>{title}</h1>
          {children}
        </main>
        <footer style={{ padding: '2rem', borderTop: '1px solid #eee', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <Link href="/terms" style={{ color: '#666', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="/privacy" style={{ color: '#666', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/refunds" style={{ color: '#666', textDecoration: 'none' }}>Refund Policy</Link>
            <Link href="/content-policy" style={{ color: '#666', textDecoration: 'none' }}>Content Policy</Link>
          </div>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            © 2024 CreatorChat Hub. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  )
}

export default LegalPageLayout