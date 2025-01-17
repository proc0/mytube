import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    access_token: string | null
  }

  interface Session {
    access_token: string
    error?: 'RefreshTokenError'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string
    expires_at?: number
    refresh_token?: string
    error?: 'RefreshTokenError'
  }
}
