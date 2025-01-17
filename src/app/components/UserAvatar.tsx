import { auth } from '@/auth'
import SignIn from './auth/signinbutton'
import Image from 'next/image'

export default async function UserAvatar() {
  const session = await auth()

  if (!session?.user) return <SignIn />

  return (
    <>
      <Image
        src={session.user.image || ''}
        alt='User Avatar'
        width={50}
        height={50}
        priority={true}
      />
    </>
  )
}
