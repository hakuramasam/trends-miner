import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import { Address, verifyMessage } from 'viem';
import { getFarcasterUserByAddress } from '@/lib/neynar';

const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'farcaster',
      name: 'Farcaster',
      type: 'credentials',
      credentials: {
        address: { label: 'Address', type: 'text' },
        message: { label: 'Message', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const { address, message, signature } = credentials as any;
          
          const isValid = await verifyMessage({
            address: address as Address,
            message: message as string,
            signature: signature as `0x${string}`,
          });

          if (!isValid) {
            console.log('Invalid signature');
            return null;
          }

          const farcasterUser = await getFarcasterUserByAddress(address as Address);
          
          return {
            id: address,
            address: address,
            farcasterUser: farcasterUser || null,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    },
  ],
  callbacks: {
    async session({ session, token }) {
      session.address = token.address as string;
      session.farcasterUser = token.farcasterUser;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.address = user.address;
        token.farcasterUser = user.farcasterUser;
      }
      return token;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };