import React, { Children } from 'react'
import { GET } from '../api/youtube/route'
// import type {  } from 'react'
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function Subscriptions({
  children,
}: {
  children: React.ReactNode
}) {
  const response = await GET()
  //   const subs = await response?.json()

  if (response?.status === 500) {
    return null
  }

  const body = await response?.json()
  const subs = body?.items

  console.log('asdfoiasjdfoiajsodfiaosidfj : ', subs)
  let subscriptions
  if (subs?.length && children) {
    const child = Children.only(children)

    subscriptions = subs.map((item) => {
      return React.cloneElement(child, {
        ...child.props,
        key: item.id,
        subscription: item,
      })
    })
  }
  return <>{subscriptions}</>
}
