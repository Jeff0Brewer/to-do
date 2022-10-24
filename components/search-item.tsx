import React, { FC } from 'react'
import { ListData } from '../lib/types'
import { dateToString } from '../lib/date'

type SearchItemProps = {
    list: ListData
}

const SearchItem: FC<SearchItemProps> = props => {
    return (
        <span>
            <p>{props.list.title}</p>
            <p>{dateToString(props.list.date)}</p>
            <button>delete</button>
        </span>
    )
}

export default SearchItem
