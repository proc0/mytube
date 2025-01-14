import { NextResponse, NextRequest } from 'next/server'
// import type { Next } from 'next'
import { google } from 'googleapis'
import { auth } from '@/auth'
// import type { YoutubeSubscription } from 'youtube-types'

// type SubscriptionResults =
//   | {
//       readonly items?: YoutubeSubscription[]
//       readonly nextPageToken?: string
//     }
//   | {
//       readonly error?: string
//     }
// type GetSusbscriptions = ({
//   params,
// }: {
//   params: Promise<{ nextPageToken: string }>
// }) => ReturnType<typeof NextResponse.json<SubscriptionResults>>

export const GET = async (
  _: NextRequest,
  {
    params,
  }: {
    params: Promise<{ nextPageToken: string }>
  }
) => {
  const session = await auth()
  const { nextPageToken } = await params

  if (!session?.access_token || new Date(session?.expires || 0) < new Date()) {
    return NextResponse.json(
      { error: 'invalid token or session' },
      { status: 401 }
    )
  }

  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  })

  const youtubeOptions = {
    part: ['snippet,contentDetails'],
    mine: true,
    maxResults: 5,
    access_token: session.access_token,
    ...(nextPageToken?.length && nextPageToken !== 'start'
      ? { pageToken: nextPageToken }
      : {}),
  }

  console.log('YOUTUBE OPTIONS', youtubeOptions)
  const { data } = await youtube.subscriptions.list(youtubeOptions)

  // console.log('YOUTUBE SUBS:', data)

  return NextResponse.json({
    items: data.items,
    nextPageToken: data.nextPageToken,
  })
}
