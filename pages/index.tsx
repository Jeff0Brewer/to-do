import React, { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import ListInterface from '../components/list-interface'
import List from '../components/list'
import { getBlankList } from '../lib/list-util'
import { ListData } from '../lib/types'

const Home: NextPage = () => {
    const [lists, setLists] = useState<Array<ListData>>([getBlankList()])
    const [listInd, setListInd] = useState<number>(0)
    return (
        <>
            <Head>
                <title>to do</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ListInterface lists={lists} setLists={setLists} listInd={listInd} setListInd={setListInd} />
            <List lists={lists} setLists={setLists} listInd={listInd} />
        </>

    )
}

export default Home
