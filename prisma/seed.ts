import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create demo users
  const jessUser = await prisma.user.upsert({
    where: { email: 'jess@creatorhub.com' },
    update: {},
    create: {
      email: 'jess@creatorhub.com',
      name: 'Jess Williams',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=400&h=400&fit=crop',
      role: 'CREATOR',
      emailVerified: new Date(),
    },
  })

  const fan1 = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      name: 'Alex Chen',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      role: 'FAN',
      emailVerified: new Date(),
    },
  })

  const fan2 = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      role: 'FAN',
      emailVerified: new Date(),
    },
  })

  // Create creator profile
  const jessCreator = await prisma.creator.upsert({
    where: { userId: jessUser.id },
    update: {},
    create: {
      userId: jessUser.id,
      handle: 'jess',
      displayName: 'Jess Williams',
      bio: 'Lifestyle content creator sharing daily adventures, wellness tips, and behind-the-scenes moments. Join my community for exclusive content and personal chats! 💕',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=400&h=400&fit=crop',
      kycStatus: 'VERIFIED',
      stripeAccountId: 'acct_demo_creator_jess',
    },
  })

  // Create fan profiles
  await prisma.fanProfile.upsert({
    where: { userId: fan1.id },
    update: {},
    create: {
      userId: fan1.id,
      displayName: 'Alex Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
  })

  await prisma.fanProfile.upsert({
    where: { userId: fan2.id },
    update: {},
    create: {
      userId: fan2.id,
      displayName: 'Sarah Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
  })

  // Create AI persona
  const defaultPersona = await prisma.persona.create({
    data: {
      creatorId: jessCreator.id,
      name: 'Jess',
      systemPrompt: 'You are Jess, a lifestyle content creator. You are bubbly, supportive, and love connecting with your fans. Use emojis naturally and share personal experiences. Keep responses personal and engaging.',
      temperature: 0.8,
      modelProvider: 'OPENAI',
      modelName: 'gpt-4o-mini',
      embeddingModel: 'text-embedding-3-small',
    },
  })

  // Update creator with default persona
  await prisma.creator.update({
    where: { id: jessCreator.id },
    data: { defaultPersonaId: defaultPersona.id },
  })

  // Create subscription tiers
  const basicTier = await prisma.subscriptionTier.create({
    data: {
      creatorId: jessCreator.id,
      name: 'Basic',
      priceCents: 999, // $9.99
      interval: 'month',
      benefits: ['Access to exclusive posts', 'Monthly live streams', 'Community access'],
      isActive: true,
    },
  })

  const premiumTier = await prisma.subscriptionTier.create({
    data: {
      creatorId: jessCreator.id,
      name: 'Premium',
      priceCents: 1999, // $19.99
      interval: 'month',
      benefits: ['Everything in Basic', 'Personal DMs', 'Weekly 1-on-1 calls', 'Custom content requests'],
      isActive: true,
    },
  })

  // Create subscriptions
  await prisma.subscription.create({
    data: {
      fanId: fan1.id,
      creatorId: jessCreator.id,
      tierId: basicTier.id,
      stripeCustomerId: 'cus_demo_alex',
      stripeSubscriptionId: 'sub_demo_alex_basic',
      status: 'ACTIVE',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  })

  await prisma.subscription.create({
    data: {
      fanId: fan2.id,
      creatorId: jessCreator.id,
      tierId: premiumTier.id,
      stripeCustomerId: 'cus_demo_sarah',
      stripeSubscriptionId: 'sub_demo_sarah_premium',
      status: 'ACTIVE',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  })

  // Create chats
  const chat1 = await prisma.chat.create({
    data: {
      creatorId: jessCreator.id,
      fanId: fan1.id,
    },
  })

  const chat2 = await prisma.chat.create({
    data: {
      creatorId: jessCreator.id,
      fanId: fan2.id,
    },
  })

  // Create demo messages
  await prisma.message.createMany({
    data: [
      {
        chatId: chat1.id,
        senderId: fan1.id,
        sender: 'FAN',
        text: "Hi Jess! Love your content, can't wait to see more 😍",
      },
      {
        chatId: chat1.id,
        senderId: jessUser.id,
        sender: 'AI',
        text: "Aww thank you so much Alex! 💕 That means the world to me! I have some exciting content coming up that I think you'll absolutely love. What type of content are you most excited to see? ✨",
      },
      {
        chatId: chat2.id,
        senderId: fan2.id,
        sender: 'FAN',
        text: "Hey Jess! Your wellness tips have been so helpful 🙏",
      },
      {
        chatId: chat2.id,
        senderId: jessUser.id,
        sender: 'AI',
        text: "Sarah, you're so sweet! 🥺 I'm thrilled that my wellness content is helping you on your journey! It's exactly why I do what I do - to support amazing people like you 💪✨ How are you feeling lately?",
      },
    ],
  })

  // Create sample content
  await prisma.content.createMany({
    data: [
      {
        creatorId: jessCreator.id,
        title: 'Morning Routine Secrets',
        description: 'My full morning routine that changed my life!',
        mediaKey: 'content/jess/morning-routine-video.mp4',
        mediaType: 'video/mp4',
        visibility: 'SUBSCRIBER',
      },
      {
        creatorId: jessCreator.id,
        title: 'Behind the Scenes Photoshoot',
        description: 'Exclusive behind-the-scenes from my latest photoshoot 📸',
        mediaKey: 'content/jess/bts-photoshoot.jpg',
        mediaType: 'image/jpeg',
        visibility: 'PPV',
        priceCents: 299, // $2.99
      },
      {
        creatorId: jessCreator.id,
        title: 'Free Wellness Guide',
        description: 'A comprehensive guide to starting your wellness journey',
        mediaKey: 'content/jess/wellness-guide.pdf',
        mediaType: 'application/pdf',
        visibility: 'FREE',
      },
    ],
  })

  // Create sample memory entries
  await prisma.memory.createMany({
    data: [
      {
        creatorId: jessCreator.id,
        kind: 'PROFILE',
        content: 'Fan Alex Chen loves fitness content and is always enthusiastic about wellness tips. Recently started a new workout routine.',
        externalRef: 'profile_alex_001',
      },
      {
        creatorId: jessCreator.id,
        kind: 'PROFILE',
        content: 'Fan Sarah Johnson is interested in mental health and mindfulness. Often asks about meditation techniques and stress management.',
        externalRef: 'profile_sarah_001',
      },
      {
        creatorId: jessCreator.id,
        kind: 'LONG_TERM',
        content: 'Fans really respond well to morning routine content and behind-the-scenes posts. Engagement is highest on wellness and lifestyle tips.',
        externalRef: 'insight_content_001',
      },
    ],
  })

  // Create sample tips
  await prisma.tip.create({
    data: {
      fanId: fan1.id,
      creatorId: jessCreator.id,
      amountCents: 500, // $5.00
      stripePaymentIntentId: 'pi_demo_tip_alex_001',
    },
  })

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: jessUser.id,
        type: 'new_subscriber',
        payload: { fanName: 'Alex Chen', tierName: 'Basic' },
      },
      {
        userId: fan1.id,
        type: 'new_content',
        payload: { contentTitle: 'Morning Routine Secrets', creatorName: 'Jess Williams' },
      },
      {
        userId: jessUser.id,
        type: 'tip_received',
        payload: { fanName: 'Alex Chen', amount: 500 },
      },
    ],
  })

  console.log('✅ Seed completed successfully!')
  console.log('📊 Created:')
  console.log('   - 3 users (1 creator, 2 fans)')
  console.log('   - 1 creator profile with KYC verified')
  console.log('   - 2 fan profiles')
  console.log('   - 1 AI persona')
  console.log('   - 2 subscription tiers')
  console.log('   - 2 active subscriptions')
  console.log('   - 2 chat conversations')
  console.log('   - 4 demo messages')
  console.log('   - 3 content items (free, subscriber, PPV)')
  console.log('   - 3 memory entries')
  console.log('   - 1 tip')
  console.log('   - 3 notifications')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })