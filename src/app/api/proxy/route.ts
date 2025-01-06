import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_GOOGLE_SECRET,
    raw: true,
  })

  console.log('proxy:', token)
  if (!token) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }

  //The "access_toke" name is up to you; you need to check how you pass it on the JWT callback
  return Response.json(token)
}

// const tokenResponse = await fetch('http://localhost:3000/api/proxy', {
//   method: 'PATCH',
//   headers: await headers(), // this is important without, the API will not be able to extract the token from the header
// })
// const tokenBody = await tokenResponse.body?.getReader().read()
// const token = String.fromCharCode.apply(
//   null,
//   (tokenBody?.value as unknown as number[]) || ([] as number[])
// )
