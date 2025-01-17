'use client'
import type { SubscriptionItem } from 'youtube-types'

export type SubcriptionProps = {
  readonly subscription?: SubscriptionItem
}

export const Subscription: React.FC<SubcriptionProps> = ({ subscription }) =>
  subscription ? (
    <div key={subscription.id}>{subscription.snippet?.title}</div>
  ) : (
    <div>Something went wrong with subscription list.</div>
  )
