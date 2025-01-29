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
import BlockWave from './BlockWave'
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
    <div className='pb-12 h-full'>
      <div className='mx-auto px-8 py-8 sm:px-4 sm:py-12 lg:max-w-6xl'>
        <div className='mx-auto grid gap-8 space-y-10 sm:gap-8 md:space-y-0 md:grid-cols-3 lg:grid-cols-4'>
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
        </div>
      </div>
      <div className='relative flex-auto grow justify-items-center'>
        <div ref={intersectionRef} className='absolute top-0'></div>
        <BlockWave />
      </div>
    </div>
  )
}
