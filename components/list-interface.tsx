import React, { FC, useEffect, useState } from 'react'
import SearchInterface from './search-interface'
import { ListData } from '../lib/types'
import styles from '../styles/ListInterface.module.css'

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
    const [lists, setLists] = useState<Array<ListData>>(testLists)
    const [listInd, setListInd] = useState<number>(0)
    const [searching, setSearching] = useState<boolean>(false)

    useEffect(() => {
        props.setList(lists[listInd])
    }, [])

    const newList = () => {
        const newLists = [...lists]
        const emptyList = getEmptyList()
        newLists.push(emptyList)
        const ind = newLists.length - 1
        setListInd(ind)
        props.setList(newLists[ind])
        setLists(newLists)
    }

    const deleteList = (ind: number) => {
        const newLists = [...lists]
        newLists.splice(ind, 1)
        if (newLists.length === 0) {
            newLists.push(getEmptyList())
        }
        setListInd(0)
        props.setList(newLists[0])
        setLists(newLists)
    }

    const toggleSearch = () => {
        setSearching(!searching)
    }

    return (
        <section>
            <div className={styles.buttons}>
                <button onClick={newList} >new</button>
                <button onClick={() => deleteList(listInd)}>delete</button>
                <button onClick={toggleSearch}>search</button>
            </div>{
                searching
                    ? <SearchInterface lists={lists} setList={props.setList} toggleSearch={toggleSearch} deleteList={deleteList} />
                    : <></>
            }
        </section>
    )
}

export default ListInterface
