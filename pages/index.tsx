import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import List from '../components/list'

const Home: NextPage = () => {
    const testDate = new Date()
    const testItems: Array<{text: string, completed: boolean}> = [
        { text: '1sdf', completed: true },
        { text: '345f', completed: false }
    ]

    return (
        <>
            <Head>
                <title>to do</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <List title={'test title'} date={testDate} items={testItems} />
        </>

    )
}

export default Home
