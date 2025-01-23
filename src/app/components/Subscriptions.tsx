'use client'
import React, {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  // useState,
} from 'react'
import useSWRInfinite from 'swr/infinite'
import type { SWRResponse } from 'swr'
import type { SubcriptionProps } from './Subscription'
import type { SubscriptionItem } from 'youtube-types'
import InfiniteScroll from '@/app/modules/InfiniteScroll'
import type { SubscriptionsResults } from '@/app/api/youtube/subscriptions/list/route'

export type SubcriptionsProps = {
  children: ReactNode
}

const getSubscriptionUrl = (
  pageIndex: number,
  previousPageData: SubscriptionsResults
) => {
  // if (!previousPageData || !cursor?.length) return null

  if (pageIndex === 0)
    return 'http://localhost:3000/api/youtube/subscriptions/list'

  return (
    'http://localhost:3000/api/youtube/subscriptions/list' +
    `?${new URLSearchParams({
      cursor: previousPageData.nextPageToken || '',
    }).toString()}`
  )
}

const fetchSubscriptions = (url: string) =>
  fetch(url).then((response) => {
    if (response.status === 500) {
      return null
    }

    return response.json()
  })

export const Subscriptions: React.FC<SubcriptionsProps> = ({ children }) => {
  // let [cursor] = useState('')
  const swr = useSWRInfinite(getSubscriptionUrl, fetchSubscriptions)

  // if (swr.isLoading) {
  //   return <>Loading...</>
  // }

  // if (swr.error || !swr.data) {
  //   return <>ERROR</>
  // }

  // let subscriptions
  const child = Children.only(children)
  // if (data.items?.length && isValidElement(child)) {
  //   subscriptions = data.items.map((item: SubscriptionItem) => {
  //     return cloneElement(child as ReactElement<SubcriptionProps>, {
  //       ...(child.props || {}),
  //       key: item.id,
  //       subscription: item,
  //     })
  //   })
  // }

  // let nextPageButton
  // if (data.nextPageToken) {
  //   nextPageButton = (
  //     <button onClick={() => setCursor(swr.data.nextPageToken)}>
  //       Next page
  //     </button>
  //   )
  // }

  // let prevPageButton
  // if (data.prevPageToken) {
  //   prevPageButton = (
  //     <button onClick={() => setCursor(swr.data.prevPageToken)}>
  //       Previous page
  //     </button>
  //   )
  // }

  return (
    <div className='bg-black'>
      <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          <InfiniteScroll
            swr={swr}
            loadingIndicator='Loading...'
            endingIndicator='No more Subscriptions'
            isReachingEnd={(swr: SWRResponse) => {
              // cursor = swr.data.nextPageToken
              return false
            }}
          >
            {(data) => {
              let subscriptions
              if (data && data.items?.length && isValidElement(child)) {
                subscriptions = data.items.map((item: SubscriptionItem) => {
                  return cloneElement(child as ReactElement<SubcriptionProps>, {
                    ...(child.props || {}),
                    key: item.id,
                    subscription: item,
                  })
                })
              }
              return subscriptions || []
            }}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}
