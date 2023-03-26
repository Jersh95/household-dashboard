import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Button } from 'react-bootstrap'
import Link from 'next/link'
import Form from 'react-bootstrap/Form';
import PageLayout from '@/components/Layout/PageLayout'

const inter = Inter({ subsets: ['latin'] })

export default function Login() {
  return (
    <>
      <PageLayout title={'Split - Login'}/>
    </>
  )
}
