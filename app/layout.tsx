import { Nunito } from 'next/font/google'
import Navbar from './components/navbar/Navbar'
import RegisterModal from './components/modals/RegisterModal'
import RentModal from './components/modals/RentModal'
import ToasterProvider from './providers/ToasterProvider'
import LoginModal from './components/modals/LoginModal'
import getCurrentUser from './actions/getCurrentUser'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata = {
  title: 'Booking App',
  description: 'My First NextJs Project',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={nunito.className}>
        <ToasterProvider />
        <LoginModal />
        <RegisterModal />
        <RentModal />
        <Navbar currentUser={currentUser}/>
        {children}
      </body>
    </html>
  )
}
