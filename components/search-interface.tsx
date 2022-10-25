import React, { FC, useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
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
    setListInd: (ind: number) => void,
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

    const selectList = (ind: number) => {
        props.setListInd(ind)
        props.toggleSearch()
    }

    return (
        <div className={styles.interfaceWrap}>
            <section className={styles.interface}>
                <span className={styles.searchHeader}>
                    <input className={styles.searchInput} type='text' placeholder='search...' onChange={updateSearch}/>
                    <button className={styles.searchClose} onClick={props.toggleSearch}><IoClose /></button>
                </span>
                <div className={styles.searchItems}>{
                    listKeys
                        .filter((listKey: ListKey) => listKey.list.title.toLowerCase().includes(searchVal))
                        .map((listKey: ListKey, i: number) => {
                            return <SearchItem key={listKey.key} list={listKey.list} deleteList={() => props.deleteList(i)} selectList={() => selectList(i)} />
                        })
                }</div>
            </section>
        </div>
    )
}

export default SearchInterface
