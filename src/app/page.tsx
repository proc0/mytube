import { Subscriptions } from './components/Subscriptions'
import { Subscription } from './components/Subscription'
import './app.css'

export default async function Home() {
  return (
    <>
      <Subscriptions>
        <Subscription />
      </Subscriptions>
    </>
  )
}
