import UserAvatar from './components/UserAvatar'
import { Subscriptions } from './components/Subscriptions'
import { Subscription } from './components/Subscription'

export default async function Home() {
  return (
    <>
      <UserAvatar />
      <Subscriptions>
        <Subscription />
      </Subscriptions>
    </>
  )
}
