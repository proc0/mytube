//This file lives in src/app/api/proxy/route.ts
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
