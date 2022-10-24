import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import List from '../components/list'
import { ItemData } from '../lib/types'

const Home: NextPage = () => {
    const testDate = new Date()
    const testItems: Array<ItemData> = [
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
