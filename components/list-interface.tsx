import React, { FC, useState, useEffect, useRef } from 'react'
import { IoMdTrash, IoMdSearch } from 'react-icons/io'
import { HiPlus } from 'react-icons/hi'
import SearchInterface from './search-interface'
import LabelButton from './label-button'
import { ListData, ItemData } from '../lib/types'
import { getBlankList } from '../lib/list-util'
import styles from '../styles/ListInterface.module.css'

type ListRes = {
    title: string,
    date: string,
    key: string,
    items: Array<ItemData>
}

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
        updateIdRef.current = window.setTimeout(() => updateList(props.list), 500)
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

    }

    const newList = () => {
        const newLists = [...lists]
        const blank = getBlankList()
        newLists.push(blank)
        props.setList(blank)
        setLists(newLists)
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
