import { Inter } from 'next/font/google'
import { Button } from 'react-bootstrap'
import PageLayout from '@/components/Layout/PageLayout'
import { signOut, signIn, useSession } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export default function Login() {

  return (
    <>
      <PageLayout title={'Split - Login'}>
       
      </PageLayout>
    </>
  )
}
