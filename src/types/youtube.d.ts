declare module 'youtube-types' {
  type YoutubeSubscription = {
    readonly kind: string
    readonly etag: string
    readonly id: string
    readonly snippet: {
      readonly publishedAt: Date
      readonly title: string
      readonly description: string
      readonly resourceId: object
      readonly channelId: string
      readonly thumbnails: object
    }
    readonly contentDetails: {
      readonly totalItemCount: number
      readonly newItemCount: number
      readonly activityType: string
    }
  }
}
