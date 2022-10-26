import React, { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import ListInterface from '../components/list-interface'
import List from '../components/list'
import { ListData } from '../lib/types'
import { getKey } from '../lib/key'

const testLists: Array<ListData> = [
    {
        title: 'list 0',
        date: new Date(),
        items: [
            {
                text: '1sdf',
                completed: true,
                children: [],
                key: getKey()
            }, {
                text: '345f',
                completed: false,
                children: [
                    {
                        text: 'fdsa',
                        completed: true,
                        children: [],
                        key: getKey()
                    }
                ],
                key: getKey()
            }, {
                text: 'mhmmmmm',
                completed: false,
                children: [
                    {
                        text: 'a',
                        completed: false,
                        children: [],
                        key: getKey()
                    }, {
                        text: 'b',
                        completed: true,
                        children: [],
                        key: getKey()
                    }, {
                        text: 'c',
                        completed: false,
                        children: [
                            {
                                text: 'd',
                                completed: false,
                                children: [],
                                key: getKey()
                            }
                        ],
                        key: getKey()
                    }
                ],
                key: getKey()
            }
        ],
        key: getKey()
    },
    {
        title: 'list 1',
        date: new Date(),
        items: [
            {
                text: 'mdmd',
                completed: false,
                children: [],
                key: getKey()
            }
        ],
        key: getKey()
    }
]

const Home: NextPage = () => {
    const [lists, setLists] = useState<Array<ListData>>(testLists)
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
