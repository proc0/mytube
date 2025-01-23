import React, { Ref, useEffect, useState } from 'react'
import type { SWRInfiniteResponse } from 'swr/infinite'
import type { SubscriptionsResults } from '@/app/api/youtube/subscriptions/list/route'

interface InfiniteScrollProps<T> {
  swr: SWRInfiniteResponse<T>
  children?: React.ReactElement | ((data?: T) => React.ReactNode[])
  loadingIndicator?: React.ReactNode
  endingIndicator?: React.ReactNode
  isReachingEnd: boolean | ((swr: SWRInfiniteResponse<T>) => boolean)
  offset?: number
}

const useIntersection = <T extends HTMLElement>(): [boolean, Ref<T>] => {
  const [intersecting, setIntersecting] = useState<boolean>(false)
  const [element, setElement] = useState<HTMLElement>()
  useEffect(() => {
    if (!element) return
    const observer = new IntersectionObserver((entries) => {
      setIntersecting(entries[0]?.isIntersecting)
    })
    observer.observe(element)
    return () => observer.unobserve(element)
  }, [element])
  return [intersecting, ((el) => el && setElement(el)) as Ref<T>]
}

const InfiniteScroll = <T,>(
  props: InfiniteScrollProps<T>
): React.ReactElement<InfiniteScrollProps<T>> => {
  const {
    swr,
    children,
    loadingIndicator,
    endingIndicator,
    isReachingEnd,
    offset = 0,
  } = props

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [intersecting, ref] = useIntersection<HTMLDivElement>()

  const ending =
    typeof isReachingEnd === 'function' ? isReachingEnd(swr) : isReachingEnd

  const content =
    typeof children === 'function' && swr.data?.length
      ? children(swr.data[swr.size - 1])
      : undefined

  useEffect(() => {
    if (intersecting && !swr.isValidating && !ending) {
      swr.setSize((size) => size + 1)
    }
  }, [intersecting])

  return (
    <>
      {content}
      <div style={{ position: 'relative' }}>
        <div ref={ref} style={{ position: 'absolute', top: offset }}></div>
        {ending ? endingIndicator : loadingIndicator}
      </div>
    </>
  )
}

export default InfiniteScroll
