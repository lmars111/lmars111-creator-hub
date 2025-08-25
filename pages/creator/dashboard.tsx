import Head from 'next/head'
import CreatorDashboard from '@/components/CreatorDashboard'
import { GetServerSideProps } from 'next'

interface CreatorDashboardPageProps {
  creator: {
    id: string
    handle: string
    displayName: string
    image?: string
    totalEarnings: number
    totalFans: number
    totalViews: number
    stripeConnected: boolean
  }
}

export default function CreatorDashboardPage({ creator }: CreatorDashboardPageProps) {
  return (
    <>
      <Head>
        <title>Creator Dashboard - {creator.displayName} | CreatorChat Hub</title>
        <meta name="description" content={`Manage your creator profile and content on CreatorChat Hub`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <CreatorDashboard creator={creator} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // In production, this would authenticate the user and fetch their creator data
  // For demo, return mock data for Jess
  
  const creator = {
    id: 'creator_jess',
    handle: 'jess',
    displayName: 'Jess Williams',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=400&h=400&fit=crop',
    totalEarnings: 2485,
    totalFans: 248,
    totalViews: 12847,
    stripeConnected: true
  }

  return {
    props: {
      creator
    }
  }
}