import React, { FC } from 'react'
import { IoMdTrash } from 'react-icons/io'
import { ListData } from '../lib/types'
import { dateToString } from '../lib/date'
import styles from '../styles/SearchInterface.module.css'

type SearchItemProps = {
    list: ListData,
    deleteList: () => void,
    selectList: () => void
}

const SearchItem: FC<SearchItemProps> = props => {
    const title = props.list.title ? props.list.title : 'untitled note'
    const dateStr = dateToString(props.list.date)

    const deleteItem = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        props.deleteList()
    }

    return (
        <a className={styles.searchItem} onClick={props.selectList}>
            <p className={styles.searchTitle}>{title}</p>
            <div className={styles.itemEnd}>
                <p className={styles.searchDate}>{dateStr}</p>
                <button className={styles.searchDelete} onClick={deleteItem}><IoMdTrash /></button>
            </div>
        </a>
    )
}

export default SearchItem
