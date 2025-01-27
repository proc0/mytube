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
  const ytUrl = `https://youtube.com/${channelInfo?.customUrl}`

  return (
    <div>
      <h3 className='text-sm'>
        <a href={ytUrl} target='blank'>
          <span aria-hidden='true' className='absolute inset-0'></span>
          {channelInfo?.title}
        </a>
      </h3>
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
      className='group h-[274px] w-[274px] [perspective:1000px] drop-shadow-xl'
    >
      <div
        onClick={(e) => {
          setStartFetching(true)
          e.currentTarget.classList.add('[transform:rotateY(180deg)]')
        }}
        className='relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:cursor-pointer'
      >
        <div className='absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden]'>
          <Image
            src={subscription.snippet?.thumbnails?.medium?.url || ''}
            alt={subscription.snippet?.title || ''}
            className='rounded-md object-coverv'
            width={274}
            height={274}
            priority={true}
          />
        </div>
        <div className='absolute inset-0 h-full w-full rounded-md bg-[#bbb] px-8 py-8 text-center text-black [transform:rotateY(180deg)] [backface-visibility:hidden]'>
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
