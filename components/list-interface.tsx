import React, { FC, useEffect, useState } from 'react'
import { IoIosAdd, IoMdTrash, IoMdSearch } from 'react-icons/io'
import { HiPlus } from 'react-icons/hi'
import SearchInterface from './search-interface'
import LabelButton from './label-button'
import { ListData } from '../lib/types'
import styles from '../styles/ListInterface.module.css'

type ListInterfaceProps = {
    lists: Array<ListData>,
    setLists: (lists: Array<ListData>) => void,
    listInd: number,
    setListInd: (ind: number) => void
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
    const [searching, setSearching] = useState<boolean>(false)

    const newList = () => {
        const newLists = [...props.lists]
        const emptyList = getEmptyList()
        newLists.push(emptyList)
        const ind = newLists.length - 1
        props.setListInd(ind)
        props.setLists(newLists)
    }

    const deleteList = (ind: number) => {
        const newLists = [...props.lists]
        newLists.splice(ind, 1)
        if (newLists.length === 0) {
            newLists.push(getEmptyList())
        }
        props.setListInd(0)
        props.setLists(newLists)
    }

    const toggleSearch = () => {
        setSearching(!searching)
    }

    return (
        <section>
            <div className={styles.buttons}>
                <LabelButton symbol={<HiPlus/>} text={'new'} onClick={newList} />
                <LabelButton symbol={<IoMdTrash/>} text={'delete'} onClick={() => deleteList(props.listInd)} />
                <LabelButton symbol={<IoMdSearch/>} text={'search'} onClick={toggleSearch} />
            </div>{
                searching
                    ? <SearchInterface lists={props.lists} setListInd={props.setListInd} toggleSearch={toggleSearch} deleteList={deleteList} />
                    : <></>
            }
        </section>
    )
}

export default ListInterface
