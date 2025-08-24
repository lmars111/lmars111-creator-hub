import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Creator Hub</title>
        <meta name="description" content="Creator Hub Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>Welcome to Creator Hub</h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>Your creative platform awaits</p>
          
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            <h2>Features</h2>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Connect with creators and their exclusive content</li>
              <li>Secure payment processing</li>
              <li>Advanced analytics and insights</li>
              <li>Community-driven platform</li>
            </ul>
          </div>
        </main>
        
        <footer style={{ padding: '2rem', borderTop: '1px solid #eee', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <Link href="/terms" style={{ color: '#666', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="/privacy" style={{ color: '#666', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/refunds" style={{ color: '#666', textDecoration: 'none' }}>Refund Policy</Link>
            <Link href="/content-policy" style={{ color: '#666', textDecoration: 'none' }}>Content Policy</Link>
          </div>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            © 2024 Creator Hub. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  )
}