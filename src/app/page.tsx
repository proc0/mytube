import UserAvatar from './components/UserAvatar'
import { Subscriptions } from './components/Subscriptions'

const Sub = ({ subscription }) => (
  <div key={subscription?.id}>{subscription.snippet?.title}</div>
)

export default function Home() {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  return (
    <>
      <UserAvatar />
      <Subscriptions>
        <Sub subscription={{ id: 'id', snippet: { title: 'title' } }} />
      </Subscriptions>
    </>
  )
}
// import { signIn } from '@/auth'

// export default function SignIn() {
//   return (
//     <form
//       action={async () => {
//         'use server'
//         await signIn('google')
//       }}
//     >
//       <button type='submit'>Signin with Google</button>
//     </form>
//   )
// }

// export default function LoginPage() {
//   const { data, status } = useSession()
//   if (status === 'loading') return <h1> loading... please wait</h1>
//   if (status === 'authenticated') {
//     const name = data?.user?.name || undefined
//     const image = data?.user?.image || undefined

//     return (
//       <div>
//         <h1> hi {name}</h1>
//         <img src={image} alt={name + ' photo'} />
//         <button onClick={() => signOut()}>sign out</button>
//       </div>
//     )
//   }
//   return (
//     <div>
//       <button onClick={() => signIn('google')}>sign in with gooogle</button>
//     </div>
//   )
// }
