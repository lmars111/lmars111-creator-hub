import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'

// For build-time, return early if Prisma isn't available
let prisma: any = null
try {
  const { prisma: prismaClient } = require('@/lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.warn('Prisma not available during build')
}

export const authOptions: NextAuthOptions = {
  ...(prisma && { adapter: PrismaAdapter(prisma) }),
  providers: [
    ...(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_FROM ? [
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
      })
    ] : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      })
    ] : []),
  ],
  session: {
    strategy: prisma ? 'database' : 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'demo-secret-for-development',
  callbacks: {
    async session({ session, user }) {
      if (session.user && prisma) {
        // Get user from database to include role and other info
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          include: {
            creator: true,
          },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.creator ? 'CREATOR' : 'FAN'
          session.user.creatorId = dbUser.creator?.id
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && prisma) {
        // Handle Google OAuth sign in
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          // Create new user with default FAN role
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
            },
          })
        }
      }
      return true
    },
  },
  session: {
    strategy: prisma ? 'database' : 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'demo-secret-for-development',
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
}