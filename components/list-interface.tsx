import React, { FC, useState, useEffect, useRef } from 'react'
import { IoMdTrash, IoMdSearch } from 'react-icons/io'
import { HiPlus } from 'react-icons/hi'
import SearchInterface from './search-interface'
import LabelButton from './label-button'
import { ListData, ListRes } from '../lib/types'
import { getBlankList } from '../lib/list-util'
import styles from '../styles/ListInterface.module.css'

type ListInterfaceProps = {
    list: ListData,
    setList: (list: ListData) => void
}

const ListInterface: FC<ListInterfaceProps> = props => {
    const [lists, setLists] = useState<Array<ListData>>([getBlankList()])
    const [searching, setSearching] = useState<boolean>(false)
    const updateIdRef = useRef<number>(0)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        updateIdRef.current = window.setTimeout(() => updateList(props.list), 1000)
        return () => {
            window.clearTimeout(updateIdRef.current)
        }
    }, [props.list])

    const fetchData = async () => {
        const res = await fetch('/api/get-lists')
        const data: Array<ListRes> = await res.json()
        const lists: Array<ListData> = data.map(list => {
            return {
                title: list.title,
                key: list.key,
                items: list.items,
                date: new Date(Date.parse(list.date))
            }
        })
        setLists(lists)
        if (lists.length) {
            props.setList(lists[0])
        }
    }

    const updateList = (list: ListData) => {
        const newLists = [...lists]
        const ind = lists.map(list => list.key).indexOf(list.key)
        newLists[ind] = list
        setLists(newLists)
        fetch('/api/update-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ list })
        })
    }

    const newList = () => {
        const newLists = [...lists]
        const blank = getBlankList()
        newLists.push(blank)
        props.setList(blank)
        setLists(newLists)
        fetch('/api/create-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ list: blank })
        })
    }

    const deleteList = (key: string) => {
        const newLists = [...lists]
        const ind = lists.map(list => list.key).indexOf(key)
        newLists.splice(ind, 1)
        if (newLists.length === 0) {
            newLists.push(getBlankList())
        }
        setLists(newLists)
        props.setList(newLists[Math.max(0, ind - 1)])
        fetch('/api/delete-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key })
        })
    }

    const toggleSearch = () => {
        setSearching(!searching)
    }

    return (
        <section>{
            searching
                ? <SearchInterface lists={lists} setList={props.setList} toggleSearch={toggleSearch} deleteList={deleteList} />
                : <div className={styles.buttons}>
                    <LabelButton symbol={<HiPlus/>} text={'create'} onClick={newList} />
                    <LabelButton symbol={<IoMdTrash/>} text={'delete'} onClick={() => deleteList(props.list.key)} />
                    <LabelButton symbol={<IoMdSearch/>} text={'search'} onClick={toggleSearch} />
                </div>
        }
        </section>
    )
}

export default ListInterface
