import '@/styles/globals.css';
import 'material-icons/iconfont/material-icons.css';
import '@/styles/bootstrap-custom.scss';
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
