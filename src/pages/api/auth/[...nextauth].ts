import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

if(!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET){
  throw new Error("Google OAuth is not configured")
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ]
})