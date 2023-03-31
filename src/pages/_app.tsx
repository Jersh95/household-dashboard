import '../styles/globals.css';
import 'material-icons/iconfont/material-icons.css';
import '../styles/bootstrap-custom.scss';
import { SessionProvider } from "next-auth/react"
import { AppProps } from 'next/app';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
