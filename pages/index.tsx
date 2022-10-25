import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import ListInterface from '../components/list-interface'
import List from '../components/list'
import { ListData } from '../lib/types'
import styles from '../styles/Home.module.css'

const testLists: Array<ListData> = [
    {
        title: 'list 0',
        date: new Date(),
        items: [
            {
                text: '1sdf',
                completed: true
            }, {
                text: '345f',
                completed: false,
                children: [
                    {
                        text: 'fdsa',
                        completed: true
                    }
                ]
            }, {
                text: 'mhmmmmm',
                completed: false,
                children: [
                    {
                        text: 'a',
                        completed: false
                    }, {
                        text: 'b',
                        completed: true
                    }, {
                        text: 'c',
                        completed: false,
                        children: [
                            {
                                text: 'd',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: 'list 1',
        date: new Date(),
        items: [
            {
                text: 'mdmd',
                completed: false
            }
        ]
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
            <div className={styles.center}>
                <List lists={lists} setLists={setLists} listInd={listInd} />
            </div>
        </>

    )
}

export default Home
