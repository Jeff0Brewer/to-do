import React, { FC, useState, useEffect } from 'react'
import Item from './item'

type ItemData = {
    text: string,
    completed: boolean
}

type ListProps = {
    title: string,
    date: Date,
    items: Array<ItemData>
}

const List: FC<ListProps> = props => {
    const [itemState, setItemState] = useState<Array<ItemData>>(props.items)

    useEffect(() => {
        console.log(itemState)
    }, [itemState])

    return (
        <section>
            <input type="text" defaultValue={props.title} />
            <div>{
                props.items.map((data: ItemData, i: number) => {
                    const setText = (val: string) => {
                        const state = [...itemState]
                        state[i].text = val
                        setItemState(state)
                    }
                    const setCompleted = (val: boolean) => {
                        const state = [...itemState]
                        state[i].completed = val
                        setItemState(state)
                    }
                    return <Item key={i} text={data.text} completed={data.completed} setText={setText} setCompleted={setCompleted}/>
                })
            }</div>
        </section>
    )
}

export default List
