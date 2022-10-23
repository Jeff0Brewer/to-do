import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Item from '../components/item'

const Home: NextPage = () => {
    const [text, setText] = useState<string>('test')
    const [completed, setCompleted] = useState<boolean>(true)

    useEffect(() => {
        console.log(completed)
    }, [completed])

    useEffect(() => {
        console.log(text)
    }, [text])

    return (
        <>
            <Head>
                <title>to do</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Item text={text} setText={setText} completed={completed} setCompleted={setCompleted} />
        </>

    )
}

export default Home
