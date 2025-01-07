import { DefaultSession } from 'next-auth'
// import { DefaultJWT } from '@auth/core/jwt'

declare module 'next-auth' {
  // Extend user to reveal access_token
  interface User {
    access_token: string | null
  }

  // Extend session to hold the access_token
  interface Session {
    access_token: string & DefaultSession
    error?: 'RefreshTokenError'
  }
}

declare module 'next-auth/jwt' {
  // Extend token to hold the access_token before it gets put into session
  interface JWT {
    access_token?: string
    expires_at?: number
    refresh_token?: string
    error?: 'RefreshTokenError'
  }
}
