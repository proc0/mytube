import { YoutubeSubscription } from '../api/youtube/route'

export type SubcriptionProps = {
  readonly subscription?: YoutubeSubscription
}

export const Subscription: React.FC<SubcriptionProps> = ({ subscription }) =>
  subscription ? (
    <div key={subscription.id}>{subscription.snippet.title}</div>
  ) : (
    <div>Something went wrong with subscription list.</div>
  )
