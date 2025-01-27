import { NextResponse, NextRequest } from 'next/server'
import { google } from 'googleapis'

import { auth } from '@/auth'
import type { ChannelItem } from 'youtube-types'

type ChannelError = {
  error: string
}

export type ChannelResults = {
  items: ChannelItem[] | undefined
}

export type GetChannelResults =
  | NextResponse<ChannelError>
  | NextResponse<ChannelResults>

type GetChannel = (request: NextRequest) => Promise<GetChannelResults>

export const GET: GetChannel = async (request) => {
  const session = await auth()
  const channelId = request.nextUrl.searchParams.get('id')

  if (!channelId)
    return NextResponse.json(
      { error: 'invalid or missing channel id' },
      { status: 402 }
    )

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

  //   const pageToken = cursor ? { pageToken: cursor } : {}
  const youtubeOptions = {
    part: ['snippet'],
    id: [channelId],
    access_token: session.access_token,
    maxResults: 1,
    // ...pageToken,
  }

  const { data } = await youtube.channels.list(youtubeOptions)

  return NextResponse.json({
    items: data.items,
    // nextPageToken: data.nextPageToken,
    // prevPageToken: data.prevPageToken,
  })
}
