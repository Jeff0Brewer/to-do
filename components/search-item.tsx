import React, { FC } from 'react'
import { ListData } from '../lib/types'
import { dateToString } from '../lib/date'
import styles from '../styles/SearchInterface.module.css'

type SearchItemProps = {
    list: ListData,
    deleteList: () => void
}

const SearchItem: FC<SearchItemProps> = props => {
    return (
        <span className={styles.searchItem}>
            <p className={styles.searchTitle}>{props.list.title}</p>
            <p className={styles.searchDate}>{dateToString(props.list.date)}</p>
            <button onClick={props.deleteList}>delete</button>
        </span>
    )
}

export default SearchItem
