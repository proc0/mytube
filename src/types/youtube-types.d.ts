declare module 'youtube-types' {
  import { youtube_v3 } from 'googleapis'
  type SubscriptionItem = youtube_v3.Schema$Subscription
  type ChannelItem = youtube_v3.Schema$Channel
}
