import React, { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import ListInterface from '../components/list-interface'
import List from '../components/list'
import { getBlankList } from '../lib/list-util'
import { ListData } from '../lib/types'

const Home: NextPage = () => {
    const [list, setList] = useState<ListData>(getBlankList())
    return (
        <>
            <Head>
                <title>to do</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ListInterface list={list} setList={setList} />
            <List list={list} setList={setList} />
        </>

    )
}

export default Home
