/**
 * NextAuth.js v5 Configuration
 * 
 * Authentication with:
 * - Credentials Provider (email/password)
 * - Google OAuth
 * - Facebook OAuth
 * 
 * Database: PostgreSQL (pg adapter)
 */

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { getUserByEmail, createUser } from '@/lib/db/users'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Get user from database
        const user = await getUserByEmail(email)

        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Check password
        if (!user.password_hash) {
          throw new Error('Please use OAuth to sign in')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash)

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar_url,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth user - create if doesn't exist
      if (account?.provider !== 'credentials') {
        const existingUser = await getUserByEmail(user.email!)

        if (!existingUser) {
          // Create new user for OAuth
          await createUser({
            id: user.id || crypto.randomUUID(),
            email: user.email!,
            name: user.name || undefined,
            avatar_url: user.image || undefined,
          })
        }
      }

      return true
    },
    async jwt({ token, user }) {
      // Add user ID to token
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Add user ID to session
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
})
