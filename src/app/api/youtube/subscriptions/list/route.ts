import { NextResponse, NextRequest } from 'next/server'
import { google } from 'googleapis'

import { auth } from '@/auth'
import type { SubscriptionItem } from 'youtube-types'

type SubscriptionsError = {
  error: string
}

type SubscriptionsResults = {
  items: SubscriptionItem[] | undefined
  nextPageToken: string | null | undefined
  prevPageToken: string | null | undefined
}

type GetSubscriptionsResults =
  | NextResponse<SubscriptionsError>
  | NextResponse<SubscriptionsResults>

type GetSubscriptions = (
  request: NextRequest
) => Promise<GetSubscriptionsResults>

export const GET: GetSubscriptions = async (request) => {
  const session = await auth()
  const cursor = request.nextUrl.searchParams.get('cursor')

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

  const pageToken = cursor ? { pageToken: cursor } : {}
  const youtubeOptions = {
    part: ['snippet,contentDetails'],
    mine: true,
    maxResults: 5,
    access_token: session.access_token,
    ...pageToken,
  }

  const { data } = await youtube.subscriptions.list(youtubeOptions)

  return NextResponse.json({
    items: data.items,
    nextPageToken: data.nextPageToken,
    prevPageToken: data.prevPageToken,
  })
}
