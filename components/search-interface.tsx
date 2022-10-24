import React, { FC, useState, useEffect } from 'react'
import SearchItem from './search-item'
import { ListData } from '../lib/types'
import { getKey, clearKeys } from '../lib/key'
import styles from '../styles/SearchInterface.module.css'

type ListKey = {
    list: ListData,
    key: string
}

type SearchInterfaceProps = {
    lists: Array<ListData>,
    setList: (list: ListData) => void,
    toggleSearch: () => void,
    deleteList: (ind: number) => void
}

const SearchInterface: FC<SearchInterfaceProps> = props => {
    const [listKeys, setListKeys] = useState<Array<ListKey>>([])

    useEffect(() => {
        clearKeys()
        setListKeys(props.lists.map((list: ListData) => {
            return {
                list,
                key: getKey(5)
            }
        }))
    }, [props.lists])

    return (
        <section className={styles.interface}>
            <span>
                <input type='text' />
                <button onClick={props.toggleSearch}>X</button>
            </span>
            <div className={styles.lists}>{
                listKeys.map((listKey: ListKey, i: number) => {
                    return <SearchItem key={listKey.key} list={listKey.list} deleteList={() => props.deleteList(i)} />
                })
            }</div>
        </section>
    )
}

export default SearchInterface
