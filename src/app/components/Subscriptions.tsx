import React from 'react'
// import type {  } from 'react'
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function Subscriptions({ children }) {
  const response = await fetch('http://localhost:3000/api/youtube')
  //   const subs = await response?.json()

  const body = await response.json()
  const subs = body?.items
  console.log('asdfoiasjdfoiajsodfiaosidfj : ', response, body)

  let subscriptions
  if (subs?.items?.length) {
    subscriptions = subs.items.map((item) => {
      return React.cloneElement(children[0], {
        ...children[0].props,
        subscription: item,
      })
    })
  }
  return <>{subscriptions}</>
}
