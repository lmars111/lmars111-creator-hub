import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'FAN' | 'CREATOR' | 'ADMIN'
      creatorId?: string
      fanProfileId?: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: 'FAN' | 'CREATOR' | 'ADMIN'
    creatorId?: string
    fanProfileId?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: 'FAN' | 'CREATOR' | 'ADMIN'
    creatorId?: string
    fanProfileId?: string
  }
}