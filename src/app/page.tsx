import { Subscriptions } from './components/Subscriptions'
import { Subscription } from './components/Subscription'

export default async function Home() {
  return (
    <>
      <Subscriptions>
        <Subscription />
      </Subscriptions>
    </>
  )
}
