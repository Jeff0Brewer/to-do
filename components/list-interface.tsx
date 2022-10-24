import React, { FC, useEffect, useState } from 'react'
import SearchInterface from './search-interface'
import { ListData } from '../lib/types'
import styles from '../styles/ListInterface.module.css'

const lists: Array<ListData> = [
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

type ListInterfaceProps = {
    setList: (list: ListData) => void
}

const getEmptyList = () => {
    return {
        title: '',
        date: new Date(),
        items: [
            {
                text: '',
                completed: false
            }
        ]
    }
}

const ListInterface: FC<ListInterfaceProps> = props => {
    const [listInd, setListInd] = useState<number>(0)

    useEffect(() => {
        props.setList(lists[listInd])
    }, [])

    const newList = () => {
        const emptyList = getEmptyList()
        lists.push(emptyList)
        const ind = lists.length - 1
        setListInd(ind)
        props.setList(lists[ind])
    }

    const deleteList = () => {
        lists.splice(listInd, 1)
        if (lists.length === 0) {
            lists.push(getEmptyList())
        }
        setListInd(0)
        props.setList(lists[0])
    }

    return (
        <section>
            <div className={styles.buttons}>
                <button onClick={newList} >new</button>
                <button onClick={deleteList}>delete</button>
                <button>search</button>
            </div>
            <SearchInterface lists={lists} setList={props.setList} />
        </section>
    )
}

export default ListInterface
