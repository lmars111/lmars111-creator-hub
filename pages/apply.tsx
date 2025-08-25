import Head from 'next/head'
import CreatorSignupWizard from '@/components/CreatorSignupWizard'

export default function Apply() {
  return (
    <>
      <Head>
        <title>Become a Creator - CreatorChat Hub</title>
        <meta name="description" content="Join our creator community and start earning today" />
      </Head>
      
      <CreatorSignupWizard />
    </>
  )
}