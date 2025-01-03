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
  // session: {
  //   strategy: 'jwt',
  // },
  // cookies: {
  //   sessionToken: {
  //     name: '__Secure-next-auth.session-token',
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: true,
  //       domain: 'localhost',
  //     },
  //   },
  // },
  callbacks: {
    async jwt(params) {
      console.log('JWTparams:', params)
      if (params.account) {
        params.token.access_token = params.account?.access_token
      }
      return params.token
    },
    async session(params) {
      console.log('params. BEFORE:', params)

      if (params.session && params.token?.access_token) {
        params.session = Object.assign({}, params.session, {
          access_token: params.token.access_token,
        })
        console.log('sessioncallback:', params.session)
      }

      return params.session
    },
  },
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig)
