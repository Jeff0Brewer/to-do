import React, { FC, useState, useEffect } from 'react'
import SearchItem from './search-item'
import { ListData } from '../lib/types'
import { getKey, clearKeys } from '../lib/key'
import styles from '../styles/SearchInterface.module.css'

type SearchInterfaceProps = {
    lists: Array<ListData>,
    setList: (list: ListData) => void
}

const SearchInterface: FC<SearchInterfaceProps> = props => {
    const [keys, setKeys] = useState<Array<string>>([])

    useEffect(() => {
        clearKeys()
        const newKeys = []
        for (let i = 0; i < props.lists.length; i++) {
            newKeys.push(getKey(5))
        }
        setKeys(newKeys)
    }, [props.lists])

    return (
        <section className={styles.interface}>
            <input type='text' />
            <div className={styles.lists}>{
                props.lists.map((list: ListData, i: number) => {
                    return <SearchItem key={keys[i]} list={list} />
                })
            }</div>
        </section>
    )
}

export default SearchInterface
