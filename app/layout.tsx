import { Nunito } from 'next/font/google'
import Navbar from './components/navbar/Navbar'
import RegisterModal from './components/modals/RegisterModal'
import './globals.css'
import ToasterProvider from './providers/ToasterProvider'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata = {
  title: 'Booking App',
  description: 'My First NextJs Project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <ToasterProvider />
        <RegisterModal />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
