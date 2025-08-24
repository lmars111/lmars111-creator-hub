import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo user and creator "jess"
  const jessUser = await prisma.user.upsert({
    where: { email: 'jess@creatorhub.com' },
    update: {},
    create: {
      email: 'jess@creatorhub.com',
      name: 'Jess Williams',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=400&h=400&fit=crop',
    },
  })

  const jessCreator = await prisma.creator.upsert({
    where: { handle: 'jess' },
    update: {},
    create: {
      userId: jessUser.id,
      handle: 'jess',
      displayName: 'Jess Williams',
      bio: 'Lifestyle content creator sharing daily adventures, wellness tips, and behind-the-scenes moments. Join my community for exclusive content and personal chats! 💕',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=400&h=400&fit=crop',
      headerImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
      isVerified: true,
      isActive: true,
      totalEarnings: 1250.75,
      totalFans: 248,
      totalMessages: 1847,
    },
  })

  // Create locked content for jess
  const lockedMessage = await prisma.content.create({
    data: {
      creatorId: jessCreator.id,
      title: 'Behind the Scenes: Morning Routine 🌅',
      description: 'Get an exclusive look at my actual morning routine! This includes my skincare secrets, workout tips, and the smoothie recipe everyone asks about.',
      type: 'TEXT',
      price: 9.00,
      isLocked: true,
      mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      unlockCount: 23,
    },
  })

  // Create AI config for jess
  await prisma.aIConfig.create({
    data: {
      creatorId: jessCreator.id,
      personality: JSON.stringify({
        traits: ['friendly', 'bubbly', 'supportive', 'authentic'],
        style: 'Uses lots of emojis, casual language, and personal anecdotes'
      }),
      tone: 'conversational',
      topics: JSON.stringify(['wellness', 'lifestyle', 'beauty', 'fitness', 'daily life']),
      responseLength: 'medium',
      creativity: 0.8,
      isEnabled: true,
      systemPrompt: 'You are Jess, a lifestyle content creator. You are bubbly, supportive, and love connecting with your fans. Use emojis naturally and share personal experiences.',
    },
  })

  // Create some demo fans
  const fan1 = await prisma.user.create({
    data: {
      email: 'fan1@example.com',
      name: 'Alex Chen',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
  })

  const fan2 = await prisma.user.create({
    data: {
      email: 'fan2@example.com', 
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
  })

  // Create fan relationships
  await prisma.creatorFan.createMany({
    data: [
      { creatorId: jessCreator.id, userId: fan1.id },
      { creatorId: jessCreator.id, userId: fan2.id },
    ],
  })

  // Create conversations
  const conv1 = await prisma.conversation.create({
    data: {
      creatorId: jessCreator.id,
      fanId: fan1.id,
    },
  })

  const conv2 = await prisma.conversation.create({
    data: {
      creatorId: jessCreator.id,
      fanId: fan2.id,
    },
  })

  // Create some demo messages
  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderId: fan1.id,
        text: "Hi Jess! Love your content, can't wait to see more 😍",
        type: 'TEXT',
        isFromCreator: false,
      },
      {
        conversationId: conv1.id,
        senderId: jessUser.id,
        text: "Aww thank you so much Alex! 💕 I have some amazing content coming up that I think you'll love!",
        type: 'TEXT',
        isFromCreator: true,
        isFromAI: true,
      },
      {
        conversationId: conv2.id,
        senderId: fan2.id,
        text: "Your morning routine post was so inspiring! Do you have any tips for staying motivated?",
        type: 'TEXT',
        isFromCreator: false,
      },
    ],
  })

  // Create demo purchases
  await prisma.purchase.createMany({
    data: [
      {
        userId: fan1.id,
        creatorId: jessCreator.id,
        contentId: lockedMessage.id,
        amount: 9.00,
        platformFee: 1.80,
        creatorEarnings: 7.20,
        stripePaymentId: 'pi_demo_payment_1',
        status: 'COMPLETED',
        type: 'CONTENT_UNLOCK',
        processedAt: new Date(),
      },
    ],
  })

  // Create analytics events
  await prisma.analytics.createMany({
    data: [
      {
        userId: fan1.id,
        creatorId: jessCreator.id,
        event: 'VIEW_CREATOR',
        properties: JSON.stringify({ source: 'direct', timestamp: new Date() }),
      },
      {
        userId: fan1.id,
        creatorId: jessCreator.id,
        event: 'CHAT_START',
        properties: JSON.stringify({ timestamp: new Date() }),
      },
      {
        userId: fan1.id,
        creatorId: jessCreator.id,
        event: 'UNLOCK_SUCCESS',
        properties: JSON.stringify({ contentId: lockedMessage.id, amount: 9.00, timestamp: new Date() }),
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log('Demo creator: jess (handle: @jess)')
  console.log('Demo fans: Alex Chen, Sarah Johnson')
  console.log('Demo locked content: $9 morning routine message')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })