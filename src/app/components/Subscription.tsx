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

  if (error || !data || !data.items?.length) return null

  const channelInfo = (data.items[0] as ChannelItem).snippet
  const channelStats = (data.items[0] as ChannelItem).statistics
  const ytUrl = `https://youtube.com/${channelInfo?.customUrl}`

  return (
    <div>
      <h3 className='text-sm'>
        <a href={ytUrl} target='blank'>
          {channelInfo?.title}
        </a>
      </h3>
      <p className='mt-1'>{channelStats?.subscriberCount}</p>
      <p className='mt-1'>{channelInfo?.description}</p>
    </div>
  )
}

export type SubcriptionProps = {
  readonly subscription?: SubscriptionItem
}

export const Subscription: React.FC<SubcriptionProps> = ({ subscription }) => {
  const [startFetching, setStartFetching] = useState(false)

  if (!subscription)
    return <div>Something went wrong with subscription list.</div>

  return (
    <div
      key={subscription.id}
      className='group h-[380px] w-[274px] [perspective:1000px] drop-shadow-xl'
    >
      <div
        onClick={(e) => {
          if (!startFetching) {
            setStartFetching(true)
            e.currentTarget.classList.add('[transform:rotateY(180deg)]')
          } else {
            setStartFetching(false)
            e.currentTarget.classList.remove('[transform:rotateY(180deg)]')
          }
        }}
        className='relative h-full w-full shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:cursor-pointer'
      >
        <div className='absolute inset-0 h-full w-full [backface-visibility:hidden] p-2 pt-12 border-[1px] border-black container rounded-xl'>
          <Image
            src={subscription.snippet?.thumbnails?.medium?.url || ''}
            alt={subscription.snippet?.title || ''}
            className='border-4 border-black border-t-[0] border-b-[0] [clip-path:circle(49%_at_50%_50%)]'
            width={274}
            height={274}
            priority={true}
          />
          <div className='p-6 rounded-t-md truncate text-ellipsis text-xl text-center'>
            {subscription.snippet?.title || ''}
          </div>
        </div>
        <div className='absolute inset-0 h-full w-full bg-[#bbb] px-8 py-8 text-center text-black [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-xl'>
          {startFetching ? (
            <ChannelDetails
              channelId={subscription?.snippet?.resourceId?.channelId}
            />
          ) : undefined}
        </div>
      </div>
    </div>
  )
}
