'use client'
import React, {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useState,
} from 'react'
import useSWR from 'swr'
import type { SubcriptionProps } from './Subscription'
import type { SubscriptionItem } from 'youtube-types'

export type SubcriptionsProps = {
  children: ReactNode
}

const getSubscriptionUrl = (cursor?: string) =>
  'http://localhost:3000/api/youtube/subscriptions/list' +
  (cursor?.length ? `?${new URLSearchParams({ cursor }).toString()}` : '')

const fetchSubscriptions = (url: string) =>
  fetch(url).then((response) => {
    if (response.status === 500) {
      return null
    }

    return response.json()
  })

export const Subscriptions: React.FC<SubcriptionsProps> = ({ children }) => {
  const [cursor, setCursor] = useState('')
  const { data, error, isLoading } = useSWR(
    getSubscriptionUrl(cursor),
    fetchSubscriptions,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  )

  if (isLoading) {
    return <>Loading...</>
  }

  if (error || !data) {
    return <>ERROR</>
  }

  let subscriptions
  const child = Children.only(children)
  if (data.items?.length && isValidElement(child)) {
    subscriptions = data.items.map((item: SubscriptionItem) => {
      return cloneElement(child as ReactElement<SubcriptionProps>, {
        ...(child.props || {}),
        key: item.id,
        subscription: item,
      })
    })
  }

  let nextPageButton
  if (data.nextPageToken) {
    nextPageButton = (
      <button onClick={() => setCursor(data.nextPageToken)}>Next page</button>
    )
  }

  let prevPageButton
  if (data.prevPageToken) {
    prevPageButton = (
      <button onClick={() => setCursor(data.prevPageToken)}>
        Previous page
      </button>
    )
  }

  return (
    <div className='bg-black'>
      <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {subscriptions}
        </div>
      </div>
      {prevPageButton}
      {nextPageButton}
    </div>
  )
}
