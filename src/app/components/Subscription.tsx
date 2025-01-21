'use client'
import type { SubscriptionItem } from 'youtube-types'

export type SubcriptionProps = {
  readonly subscription?: SubscriptionItem
}

export const Subscription: React.FC<SubcriptionProps> = ({ subscription }) =>
  subscription ? (
    <div key={subscription.id} className='group relative'>
      <img
        src={subscription.snippet?.thumbnails?.medium?.url || undefined}
        alt='Front of men&#039;s Basic Tee in black.'
        className='aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80'
      />
      <div className='mt-4 flex justify-between'>
        <div>
          <h3 className='text-sm text-gray-700'>
            <a href='#'>
              <span aria-hidden='true' className='absolute inset-0'></span>
              {subscription.snippet?.title}
            </a>
          </h3>
          <p className='mt-1 text-sm text-gray-500'>Black</p>
        </div>
        <p className='text-sm font-medium text-gray-900'>$35</p>
      </div>
    </div>
  ) : (
    <div>Something went wrong with subscription list.</div>
  )
