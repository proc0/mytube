'use client'
import React, {
  Children,
  ReactElement,
  ReactNode,
  // cache,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
} from 'react'
// import { GET } from '../api/youtube/subscriptions/[nextPageToken]/list/route'
import type { SubcriptionProps } from './Subscription'
import type { YoutubeSubscription } from 'youtube-types'

export type SubcriptionsProps = {
  children: ReactNode
}

export const Subscriptions: React.FC<SubcriptionsProps> = ({ children }) => {
  const [nextPageToken, setNextPageToken] = useState('')
  const [body, setBody] = useState({ items: [], nextPageToken: '' })
  useEffect(() => {
    fetch(
      'http://localhost:3000/api/youtube/subscriptions' +
        (nextPageToken.length ? `/${nextPageToken}` : '/start') +
        '/list'
    )
      .then((res) => {
        if (res?.status === 500) {
          return null
        }

        return res?.json()
      })
      .then((res2) => {
        console.log('RES2', res2)

        return setBody(res2)
      })
  }, [nextPageToken])

  if (!body.items.length) {
    return <>Loading...</>
  }
  let subscriptions
  const child = Children.only(children)
  if (body?.items?.length && isValidElement(child)) {
    subscriptions = body.items.map((item: YoutubeSubscription) => {
      return cloneElement(child as ReactElement<SubcriptionProps>, {
        ...(child.props || {}),
        key: item.id,
        subscription: item,
      })
    })
  }

  let nextPageButton
  if (body?.nextPageToken) {
    nextPageButton = (
      <button onClick={() => setNextPageToken(body.nextPageToken)}>
        Next page
      </button>
    )
  }
  return (
    <>
      {subscriptions}
      {nextPageButton}
    </>
  )
}
