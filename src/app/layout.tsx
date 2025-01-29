import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import NavBar from './components/NavBar'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyTube',
  description: 'Manage your YouTube subscriptions, playlists, and more.',
}

const lato = Lato({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
})

type LayoutProps = {
  children: React.ReactNode
}

export default async function Layout({ children }: Readonly<LayoutProps>) {
  return (
    <html lang='en'>
      <body className={`${lato.className} antialiased`}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
