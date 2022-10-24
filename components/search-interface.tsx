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
    const [searchVal, setSearchVal] = useState<string>('')

    useEffect(() => {
        clearKeys()
        setListKeys(props.lists.map((list: ListData) => {
            return {
                list,
                key: getKey(5)
            }
        }))
    }, [props.lists])

    const updateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchVal(e.target.value.toLowerCase())
    }

    return (
        <section className={styles.interface}>
            <span>
                <input type='text' onChange={updateSearch}/>
                <button onClick={props.toggleSearch}>X</button>
            </span>
            <div className={styles.lists}>{
                listKeys
                    .filter((listKey: ListKey) => listKey.list.title.toLowerCase().includes(searchVal))
                    .map((listKey: ListKey, i: number) => {
                        return <SearchItem key={listKey.key} list={listKey.list} deleteList={() => props.deleteList(i)} />
                    })
            }</div>
        </section>
    )
}

export default SearchInterface
