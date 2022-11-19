import React, { FC, useState } from 'react'
import { Session } from 'next-auth'
import ListInterface from '../components/list-interface'
import List from '../components/list'
import { getBlankList } from '../lib/list-util'
import { ListData } from '../lib/types'

type ListsProps = {
    session: Session
}

const Lists: FC<ListsProps> = props => {
    const [list, setList] = useState<ListData>(getBlankList(props.session.user.email))
    return (
        <section>
            <ListInterface list={list} setList={setList} session={props.session} />
            <List list={list} setList={setList} />
        </section>

    )
}

export default Lists
