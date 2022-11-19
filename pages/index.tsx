import React from 'react'
import { useSession } from 'next-auth/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Lists from '../components/lists'
import SignIn from '../components/sign-in'

const Home: NextPage = () => {
    const { data: session, status: sessionStatus } = useSession()
    if (sessionStatus === 'loading') { return <></> }

    return (
        <main>
            <Head>
                <title>to do</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>{
                session
                    ? <Lists session={session} />
                    : <SignIn />
            }
        </main>

    )
}

export default Home
