import { Inter } from 'next/font/google'
import { Button } from 'react-bootstrap'
import { signOut, signIn, useSession } from 'next-auth/react'
import { PageLayout } from '../components/Layout/PageLayout'

// const inter = Inter({ subsets: ['latin'] })

export default function Login() {

  return (
      <PageLayout title={'Split - Login'}>
        
      </PageLayout>
  )
}
