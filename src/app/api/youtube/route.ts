import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { auth } from '@/auth'
import 'server-only'

export type YoutubeSubscription = {
  readonly kind: string
  readonly etag: string
  readonly id: string
  readonly snippet: {
    readonly publishedAt: Date
    readonly title: string
    readonly description: string
    readonly resourceId: object
    readonly channelId: string
    readonly thumbnails: object
  }
  readonly contentDetails: {
    readonly totalItemCount: number
    readonly newItemCount: number
    readonly activityType: string
  }
}

export async function GET() {
  const session = await auth()

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

  const { data } = await youtube.subscriptions.list({
    part: ['snippet,contentDetails'],
    mine: true,
    maxResults: 5,
    access_token: session.access_token,
  })

  console.log('YOUTUBE SUBS:', data)

  return NextResponse.json({ items: data.items })
}
