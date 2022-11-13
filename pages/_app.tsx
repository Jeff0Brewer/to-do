import React from 'react'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp ({
    Component,
    pageProps
}: AppProps<{
    session: Session
}>) {
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default MyApp
