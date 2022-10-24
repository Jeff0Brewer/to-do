import React, { FC } from 'react'
import { ListData } from '../lib/types'
import { dateToString } from '../lib/date'
import styles from '../styles/SearchInterface.module.css'

type SearchItemProps = {
    list: ListData,
    deleteList: () => void
}

const SearchItem: FC<SearchItemProps> = props => {
    const title = props.list.title ? props.list.title : 'untitled note'
    const dateStr = dateToString(props.list.date)
    return (
        <span className={styles.searchItem}>
            <p className={styles.searchTitle}>{title}</p>
            <p className={styles.searchDate}>{dateStr}</p>
            <button onClick={props.deleteList}>delete</button>
        </span>
    )
}

export default SearchItem
