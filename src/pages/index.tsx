import { Inter } from 'next/font/google'
import PageLayout from '../components/Layout/PageLayout'
import { Dashboard } from './Dashboard/Dashboard'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <PageLayout title='Household Dashboard'>
      <Dashboard/>
    </PageLayout>
  )
}
