import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

type RefreshResponse = {
  access_token: string
  expires_in: number
  refresh_token?: string
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          response_type: 'code',
          scope: 'openid email profile https://www.googleapis.com/auth/youtube',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log('first login:', token, account)
        const { access_token, expires_at, refresh_token } = account
        return {
          ...token,
          access_token,
          expires_at,
          refresh_token,
        }
      } else if (token.expires_at && Date.now() < token.expires_at) {
        console.log('token is still valid')
        return token
      } else if (token.refresh_token) {
        // console.log('refreshing token:', token)
        try {
          if (token.error) throw token
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token! as string,
            }),
          })

          const refreshResponse: RefreshResponse = await response.json()
          console.log('refreshing token response:', refreshResponse)

          if (!response.ok) throw refreshResponse

          const { access_token, expires_in, refresh_token } = refreshResponse
          const expires_at = Date.now() + expires_in * 1000

          return {
            ...token,
            access_token,
            expires_at,
            // preserve refresh_token if provider only issues refresh tokens once
            refresh_token: refresh_token || token.refresh_token,
          }
        } catch (error) {
          console.error('Error refreshing access_token', error)
          token.error = 'RefreshTokenError'
          return token
        }
      } else {
        throw new TypeError('Invalid token: No account or refresh_token.')
      }
    },
    async session({ session, token }) {
      if (token.access_token) {
        const { access_token, error } = token
        session = {
          ...session,
          access_token,
          error,
        }
        // console.log('session with token:', session)
      }
      return session
    },
  },
})
