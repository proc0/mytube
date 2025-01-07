import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile https://www.googleapis.com/auth/youtube',
        },
      },
    }),
  ],
  callbacks: {
    async jwt(params) {
      console.log('JWTcallback:', params)
      if (params.account) {
        params.token.access_token = params.account?.access_token
      }
      return params.token
    },
    async session(params) {
      console.log('sessioncallback:', params)

      if (params.session && params.token?.access_token) {
        params.session = Object.assign({}, params.session, {
          access_token: params.token.access_token,
        })
        console.log('sessioncallback WITH TOKEN:', params.session)
      }

      return params.session
    },
  },
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig)
