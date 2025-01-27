'use client'
import { useState } from 'react'
import type { ChannelItem, SubscriptionItem } from 'youtube-types'
import Image from 'next/image'
import useSWR from 'swr'

const fetchChannel = (url: string) =>
  fetch(url).then((response) => {
    if (response.status === 500) {
      return null
    }

    return response.json()
  })

const ChannelDetails = ({
  channelId,
}: {
  channelId: string | null | undefined
}) => {
  const { data, error } = useSWR(
    channelId ? '/api/youtube/channels/list' + `?id=${channelId}` : null,
    fetchChannel,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  )

  if (error || !data) return null

  return <>{data.items?.map((d: ChannelItem) => d.snippet?.customUrl)}</>
}

export type SubcriptionProps = {
  readonly subscription?: SubscriptionItem
}

export const Subscription: React.FC<SubcriptionProps> = ({ subscription }) => {
  const [startFetching, setStartFetching] = useState(false)

  if (!subscription)
    return <div>Something went wrong with subscription list.</div>

  return (
    <div key={subscription.id} className='group relative'>
      <Image
        src={subscription.snippet?.thumbnails?.medium?.url || ''}
        alt={subscription.snippet?.title || ''}
        className='aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto'
        width={274}
        height={320}
        priority={true}
      />
      <div className='mt-4 flex justify-between'>
        <div>
          <h3 className='text-sm text-gray-700'>
            <a href='#' onClick={() => setStartFetching(true)}>
              <span aria-hidden='true' className='absolute inset-0'></span>
              {subscription.snippet?.channelId}
            </a>
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            {subscription.snippet?.title}
          </p>
        </div>
        <p className='text-sm font-medium text-gray-900'>$35</p>
      </div>
      {startFetching ? (
        <ChannelDetails
          channelId={subscription?.snippet?.resourceId?.channelId}
        />
      ) : undefined}
    </div>
  )
}
