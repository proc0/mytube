import { NextResponse } from 'next/server'
import { google } from 'googleapis'
// import { headers } from 'next/headers'
// import { } from 'next-auth/authjs';
// import { cookies } from 'next/headers'
import { auth } from '@/auth'

export async function GET() {
  // const token = await getToken({
  //   req,
  //   secret: process.env.AUTH_GOOGLE_SECRET,
  // })
  // const cookie = cookies()
  // const token = await cookie.get('authjs.csrf-token')
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  })

  // const { searchParams } = new URL(request.url)
  // const q = searchParams.get('q') || 'cats'
  let response
  try {
    const session = await auth()
    // const tokenResponse = await fetch('http://localhost:3000/api/proxy', {
    //   method: 'PATCH',
    //   headers: await headers(), // this is important without, the API will not be able to extract the token from the header
    // })
    // const tokenBody = await tokenResponse.body?.getReader().read()
    // const token = String.fromCharCode.apply(
    //   null,
    //   (tokenBody?.value as unknown as number[]) || ([] as number[])
    // )
    const token = session?.access_token || null
    console.log('token:', token)

    if (token && new Date(session?.expires || 0) > new Date()) {
      response = await youtube.subscriptions.list({
        part: ['snippet,contentDetails'],
        // q: q,
        mine: true,
        maxResults: 5,
        access_token: token,
      })
    }
  } catch (error) {
    console.log('App Failure:', error)
  }

  console.log(response?.data.items)
  return NextResponse.json({ items: response?.data.items })
}
