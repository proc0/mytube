'use client'
import React, {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
} from 'react'

import type { SubcriptionProps } from './Subscription'
import type { SubscriptionItem } from 'youtube-types'

export type SubcriptionsProps = {
  children: ReactNode
}

export const Subscriptions: React.FC<SubcriptionsProps> = ({ children }) => {
  const [cursor, setCursor] = useState('')
  const [result, setResult] = useState({
    items: [],
    nextPageToken: '',
    prevPageToken: '',
  })
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('cursor', cursor)
    fetch(
      'http://localhost:3000/api/youtube/subscriptions/list' +
        (cursor?.length ? `?${params.toString()}` : '')
    )
      .then((response) => {
        if (response.status === 500) {
          return null
        }

        return response.json()
      })
      .then((result) => setResult(result))
  }, [cursor])

  if (!result) {
    return <>ERROR</>
  }

  if (!result.items.length) {
    return <>Loading...</>
  }

  let subscriptions
  const child = Children.only(children)
  if (isValidElement(child)) {
    subscriptions = result.items.map((item: SubscriptionItem) => {
      return cloneElement(child as ReactElement<SubcriptionProps>, {
        ...(child.props || {}),
        key: item.id,
        subscription: item,
      })
    })
  }

  let nextPageButton
  if (result?.nextPageToken) {
    nextPageButton = (
      <button onClick={() => setCursor(result.nextPageToken)}>Next page</button>
    )
  }

  let prevPageButton
  if (result?.prevPageToken) {
    prevPageButton = (
      <button onClick={() => setCursor(result.prevPageToken)}>
        Previous page
      </button>
    )
  }

  return (
    <>
      {subscriptions}
      {prevPageButton}
      {nextPageButton}
    </>
  )
}
