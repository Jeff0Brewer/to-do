import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import ListInterface from '../components/list-interface'
import List from '../components/list'
import { ListData } from '../lib/types'

const Home: NextPage = () => {
    const [list, setList] = useState<ListData>({
        title: '',
        date: new Date(),
        items: []
    })
    return (
        <>
            <Head>
                <title>to do</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ListInterface setList={setList} />
            <List list={list} />
        </>

    )
}

export default Home
