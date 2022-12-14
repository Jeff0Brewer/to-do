import React, { FC, useState, useEffect, useRef } from 'react'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { IoMdTrash, IoMdSearch, IoMdLogOut } from 'react-icons/io'
import { HiPlus } from 'react-icons/hi'
import SearchInterface from './search-interface'
import LabelButton from './label-button'
import { ListData, ListRes } from '../lib/types'
import { getBlankList, listResToData } from '../lib/list-util'
import styles from '../styles/ListInterface.module.css'

const postBody = (data: object) => {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
}

type ListInterfaceProps = {
    list: ListData,
    setList: (list: ListData) => void,
    setLoaded: (loaded: boolean) => void,
    session: Session
}

const ListInterface: FC<ListInterfaceProps> = props => {
    const [lists, setLists] = useState<Array<ListData>>([])
    const [searching, setSearching] = useState<boolean>(false)
    const updateIdRef = useRef<number>(0)

    useEffect(() => {
        const email = props.session.user.email
        fetch('/api/db/get-lists', postBody({ email }))
            .then(data => data.json())
            .then((res: Array<ListRes>) => {
                const lists: Array<ListData> = res.map(list => listResToData(list))
                setLists(lists)
                if (lists.length) {
                    props.setList(lists[0])
                }
                props.setLoaded(true)
            })
    }, [])

    useEffect(() => {
        updateIdRef.current = window.setTimeout(() => updateList(props.list), 1000)
        return () => {
            window.clearTimeout(updateIdRef.current)
        }
    }, [props.list])

    const updateList = (list: ListData) => {
        const newLists = [...lists]
        const newList = { ...list }
        newList.date = new Date()
        const ind = lists.map(list => list.key).indexOf(list.key)
        if (ind !== -1) {
            newLists[ind] = newList
        } else {
            newLists.push(list)
        }
        setLists(newLists)
        fetch('/api/db/update-list', postBody({ list }))
    }

    const newList = () => {
        const newLists = [...lists]
        const list = getBlankList(props.session.user.email)
        newLists.push(list)
        props.setList(list)
        setLists(newLists)
        fetch('/api/db/create-list', postBody({ list }))
    }

    const deleteList = (key: string) => {
        const newLists = [...lists]
        const ind = lists.map(list => list.key).indexOf(key)
        newLists.splice(ind, 1)
        if (newLists.length === 0) {
            newLists.push(getBlankList(props.session.user.email))
        }
        setLists(newLists)
        props.setList(newLists[Math.max(0, ind - 1)])
        fetch('/api/db/delete-list', postBody({ key }))
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
                    <LabelButton symbol={<IoMdLogOut />} text={'log out'} onClick={() => signOut()} />
                </div>
        }
        </section>
    )
}

export default ListInterface
