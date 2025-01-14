import React, {
  Children,
  ReactElement,
  ReactNode,
  // cache,
  cloneElement,
  isValidElement,
} from 'react'
// import { GET } from '../api/youtube/subscriptions/[nextPageToken]/list/route'
import type { SubcriptionProps } from './Subscription'
import type { YoutubeSubscription } from 'youtube-types'

export type SubcriptionsProps = {
  children: ReactNode
}

export const Subscriptions: React.FC<SubcriptionsProps> = async ({
  children,
}) => {
  const response = await fetch(
    'http://localhost:3000/api/youtube/subscriptions/start/list'
  )

  if (response?.status === 500) {
    return null
  }

  const body = await response?.json()
  console.log('BODY', body)

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
  return <>{subscriptions}</>
}
