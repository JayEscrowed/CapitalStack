import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions, getServerSession } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }
      
      // Handle session update
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      
      // Fetch latest user data
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            plan: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
          },
        });
        
        if (dbUser) {
          token.plan = dbUser.plan;
          token.stripeCustomerId = dbUser.stripeCustomerId;
          token.stripeSubscriptionId = dbUser.stripeSubscriptionId;
          token.stripeCurrentPeriodEnd = dbUser.stripeCurrentPeriodEnd;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as string;
        session.user.stripeCustomerId = token.stripeCustomerId as string | null;
        session.user.stripeSubscriptionId = token.stripeSubscriptionId as string | null;
        session.user.stripeCurrentPeriodEnd = token.stripeCurrentPeriodEnd as Date | null;
      }
      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);

// Type augmentation for session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string;
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
      stripeCurrentPeriodEnd?: Date | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    plan?: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    stripeCurrentPeriodEnd?: Date | null;
  }
}
