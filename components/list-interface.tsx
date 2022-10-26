import React, { FC, useState } from 'react'
import { IoMdTrash, IoMdSearch } from 'react-icons/io'
import { HiPlus } from 'react-icons/hi'
import SearchInterface from './search-interface'
import LabelButton from './label-button'
import { ListData } from '../lib/types'
import { getBlankList } from '../lib/list-util'
import styles from '../styles/ListInterface.module.css'

type ListInterfaceProps = {
    lists: Array<ListData>,
    setLists: (lists: Array<ListData>) => void,
    listInd: number,
    setListInd: (ind: number) => void
}

const ListInterface: FC<ListInterfaceProps> = props => {
    const [searching, setSearching] = useState<boolean>(false)

    const newList = () => {
        const newLists = [...props.lists]
        newLists.push(getBlankList())
        const ind = newLists.length - 1
        props.setListInd(ind)
        props.setLists(newLists)
    }

    const deleteList = (ind: number) => {
        const newLists = [...props.lists]
        newLists.splice(ind, 1)
        if (newLists.length === 0) {
            newLists.push(getBlankList())
        }
        props.setListInd(0)
        props.setLists(newLists)
    }

    const toggleSearch = () => {
        setSearching(!searching)
    }

    return (
        <section>{
            searching
                ? <SearchInterface lists={props.lists} setListInd={props.setListInd} toggleSearch={toggleSearch} deleteList={deleteList} />
                : <div className={styles.buttons}>
                    <LabelButton symbol={<HiPlus/>} text={'create'} onClick={newList} />
                    <LabelButton symbol={<IoMdTrash/>} text={'delete'} onClick={() => deleteList(props.listInd)} />
                    <LabelButton symbol={<IoMdSearch/>} text={'search'} onClick={toggleSearch} />
                </div>
        }
        </section>
    )
}

export default ListInterface
