// import { NextRequest } from 'next/server'
import { auth } from '@/auth'

export default auth
// import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from '@/lib/routes';
// const PUBLIC_ROUTES: string[] = []
// const ROOT = '/'
// const DEFAULT_REDIRECT = '/'

// export default async function authenticate(req: NextRequest) {
//   const { nextUrl } = req

//   const session = await auth()
//   const isAuthenticated = !!session
//   const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)

//   if (isPublicRoute && isAuthenticated)
//     return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))

//   if (!isAuthenticated && !isPublicRoute)
//     return Response.redirect(new URL(ROOT, nextUrl))
// }

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|_rsc).*)'],
}
