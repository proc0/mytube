'use client'
import React, {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import useSWRInfinite from 'swr/infinite'
import type { SubcriptionProps } from './Subscription'
import type { SubscriptionItem } from 'youtube-types'
import type { SubscriptionsResults } from '@/app/api/youtube/subscriptions/list/route'

export type SubcriptionsProps = {
  children: ReactNode
}

const getSubscriptionsParams = (cursor: string): string =>
  `?${new URLSearchParams({
    cursor,
  }).toString()}`

const getSubscriptionsUrl = (
  pageIndex: number,
  previousPageData: SubscriptionsResults
): string | undefined => {
  if (pageIndex === 0 && !previousPageData?.nextPageToken)
    return '/api/youtube/subscriptions/list'

  const cursor = previousPageData.nextPageToken
  if (cursor)
    return '/api/youtube/subscriptions/list' + getSubscriptionsParams(cursor)
}

const fetchSubscriptions = (url: string) =>
  fetch(url).then((response) => {
    if (response.status === 500) {
      return null
    }

    return response.json()
  })

export const Subscriptions: React.FC<SubcriptionsProps> = ({ children }) => {
  const swr = useSWRInfinite(getSubscriptionsUrl, fetchSubscriptions, {
    keepPreviousData: true,
    revalidateFirstPage: false,
  })
  const [intersecting, setIntersecting] = useState<boolean>(false)
  const intersectionRef = useRef<HTMLDivElement>(null)
  let observerRef = useRef<IntersectionObserver>(null)

  if (global?.window && !observerRef?.current) {
    observerRef = {
      current: new global.window.IntersectionObserver(([el]) => {
        if (intersecting !== el.isIntersecting) {
          setIntersecting(el.isIntersecting)
        }
      }),
    }
  }

  useEffect(() => {
    if (!intersectionRef?.current) return

    const intersection = intersectionRef.current
    const observer = observerRef.current

    observer?.observe(intersection)

    if (intersecting && !swr.isValidating) {
      swr.setSize((size) => size + 1)
    }

    return () => observer?.unobserve(intersection)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersecting])

  const child = Children.only(children)

  return (
    <div className='bg-black'>
      <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {!swr.isLoading &&
            swr.data?.map((data) => {
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
            })}
          <div style={{ position: 'relative' }}>
            <div
              ref={intersectionRef}
              style={{ position: 'absolute', top: 0 }}
            ></div>
            {swr.isValidating ? 'Loading' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
