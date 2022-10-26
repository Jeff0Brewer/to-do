import React, { FC, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import SearchItem from './search-item'
import { ListData } from '../lib/types'
import styles from '../styles/SearchInterface.module.css'

type SearchInterfaceProps = {
    lists: Array<ListData>,
    setListInd: (ind: number) => void,
    toggleSearch: () => void,
    deleteList: (ind: number) => void
}

const SearchInterface: FC<SearchInterfaceProps> = props => {
    const [searchVal, setSearchVal] = useState<string>('')

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
                    props.lists
                        .filter((list: ListData) => list.title.toLowerCase().includes(searchVal))
                        .map((list: ListData, i: number) => {
                            return <SearchItem key={list.key} list={list} deleteList={() => props.deleteList(i)} selectList={() => selectList(i)} />
                        })
                }</div>
            </section>
        </div>
    )
}

export default SearchInterface
