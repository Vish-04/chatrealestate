import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { NextApiRequest } from "next"

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: { user: any, account: any, profile?: any, email?: any, credentials?: any }) {
      const req = (credentials as any)?.req as NextApiRequest;
      const isDefaultSigninPage = req?.method === "GET" && req?.query?.nextauth?.includes("signin")
      if (isDefaultSigninPage) {
        // Hide the `GoogleProvider` when you visit `/api/auth/signin`
        return account.provider !== 'google'
      }
      return true
    },
    // ... other callbacks if needed
  },
  // ... other options if needed
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }