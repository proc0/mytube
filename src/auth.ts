import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      // Google requires "offline" access_type to provide a `refresh_token`
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
        console.log('first time login:', token, account)
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        }
      } else if (token.expires_at && Date.now() < token.expires_at * 1000) {
        console.log('token is still VALID', token)
        // Subsequent logins, but the `access_token` is still valid
        return token
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError('Missing refresh_token')

        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token!,
            }),
          })

          const tokensOrError = await response.json()

          console.log('refreshing token:', tokensOrError)

          if (!response.ok) throw tokensOrError

          const newTokens = tokensOrError as {
            access_token: string
            expires_in: number
            refresh_token?: string
          }

          return {
            ...token,
            access_token: newTokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
            // Some providers only issue refresh tokens once, so preserve if we did not get a new one
            refresh_token: newTokens.refresh_token
              ? newTokens.refresh_token
              : token.refresh_token,
          }
        } catch (error) {
          console.error('Error refreshing access_token', error)
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = 'RefreshTokenError'
          return token
        }
      }
    },
    async session({ session, token }) {
      if (session && token?.access_token) {
        session = Object.assign({}, session, {
          access_token: token.access_token,
          error: token.error,
        })
        console.log('sessioncallback WITH TOKEN:', session)
      }
      return session
    },
  },
})

// declare module 'next-auth' {
//   interface Session {
//     error?: 'RefreshTokenError'
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     access_token: string
//     expires_at: number
//     refresh_token?: string
//     error?: 'RefreshTokenError'
//   }
// }
