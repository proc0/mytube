'use client'
import { useState } from 'react'
import type { ChannelItem, SubscriptionItem } from 'youtube-types'
import { Teko } from 'next/font/google'
import Image from 'next/image'
import useSWR from 'swr'

const teko = Teko({
  subsets: ['latin'],
  display: 'swap',
})

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

  const options = { maximumSignificantDigits: 3 }
  const numberFormat = new Intl.NumberFormat('en-US', options)

  const parts = channelStats?.subscriberCount
    ? numberFormat.formatToParts(Number(channelStats.subscriberCount))
    : []

  const subCount = `${parts[0].value}${
    parts.length === 3 ? 'K' : parts.length === 5 ? 'M' : ''
  }`
  return (
    <div className='flex flex-col p-4'>
      <div className='flex flex-row'>
        <Image
          src={channelInfo?.thumbnails?.default?.url || ''}
          alt={channelInfo?.title || ''}
          className='h-[64px] [clip-path:circle(48%_at_50%_50%)]'
          width={64}
          height={64}
          priority={true}
        />
        <h3
          className={`w-full ${teko.className} text-[2em] leading-none pl-2 self-center text-center`}
        >
          <a href={ytUrl} target='blank'>
            {channelInfo?.title}
          </a>
        </h3>
      </div>
      <p className='w-full text-left pl-2 text-xl'>
        <b>{subCount}</b>
      </p>
      <p className=' h-[135px] text-left text-sm mt-4 overflow-scroll text-ellipsis no-scrollbar'>
        {channelInfo?.description}
      </p>
      <button className='justify-self-end p-4 bg-blood mt-4'>
        Unsubscribe
      </button>
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
        <div className='absolute inset-0 h-full w-full card-bg [backface-visibility:hidden] p-2 pt-8 border-[1px] border-black rounded-xl'>
          <Image
            src={subscription.snippet?.thumbnails?.medium?.url || ''}
            alt={subscription.snippet?.title || ''}
            className='h-[274px] pb-2 pt-2 [clip-path:circle(48%_at_50%_50%)]'
            width={274}
            height={274}
            priority={true}
          />
          <div
            className={`mt-2 truncate text-ellipsis text-[2em] text-center ${teko.className}`}
          >
            {subscription.snippet?.title || ''}
          </div>
        </div>
        <div className='absolute inset-0 h-full w-full bg-dirt text-center [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-xl border-[18px] border-blood'>
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
