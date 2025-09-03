import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { config, validateConfig } from '@/lib/config'

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
    // Credentials provider for email/password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        if (!prisma) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { creator: true, fanProfile: true }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        // Check if user is verified and active
        if (user.status !== 'ACTIVE' || !user.emailVerified) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          creatorId: user.creator?.id,
          fanProfileId: user.fanProfile?.id,
        }
      }
    }),

    // Email provider (optional)
    ...(config.email.enabled ? [
      EmailProvider({
        server: {
          host: config.email.server.host!,
          port: config.email.server.port!,
          auth: {
            user: config.email.server.user!,
            pass: config.email.server.password!,
          },
        },
        from: config.email.from!,
      })
    ] : []),
    
    // Google provider (optional)
    ...(config.google.enabled ? [
      GoogleProvider({
        clientId: config.google.clientId!,
        clientSecret: config.google.clientSecret!,
      })
    ] : []),

    // Apple provider (optional)
    ...(config.apple.enabled ? [
      AppleProvider({
        clientId: config.apple.clientId!,
        clientSecret: config.apple.clientSecret!,
      })
    ] : []),
  ],
  session: {
    strategy: prisma ? 'database' : 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: config.auth.secret,
  callbacks: {
    async session({ session, user }) {
      if (session.user && prisma) {
        // Get user from database to include role and other info
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          include: {
            creator: true,
            fanProfile: true,
          },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role
          session.user.creatorId = dbUser.creator?.id
          session.user.fanProfileId = dbUser.fanProfile?.id
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
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              role: 'FAN', // Default role
              emailVerified: new Date(),
            },
          })

          // Create fan profile
          await prisma.fanProfile.create({
            data: {
              userId: newUser.id,
              displayName: user.name || undefined,
              avatarUrl: user.image || undefined,
            },
          })
        }
      }
      
      if (account?.provider === 'email' && prisma) {
        // Handle email sign in
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          // User will be created by the adapter, but we need to set default role
          // This will be handled in the user creation process
        }
      }
      
      return true
    },
    async jwt({ token, user, account }) {
      // Include role in JWT for edge cases
      if (user && prisma) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: {
            creator: true,
          },
        })
        
        if (dbUser) {
          token.role = dbUser.role
          token.creatorId = dbUser.creator?.id
        }
      }
      return token
    }
  },
  events: {
    async createUser({ user }) {
      // Set default role and create fan profile for new users
      if (prisma && user.email) {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { role: 'FAN' },
        })

        // Create fan profile
        await prisma.fanProfile.create({
          data: {
            userId: updatedUser.id,
            displayName: user.name || undefined,
            avatarUrl: user.image || undefined,
          },
        })
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
}