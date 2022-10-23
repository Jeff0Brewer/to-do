import React, { FC, useState } from 'react'
import Item from './item'
import { getKey, removeKey } from '../lib/key'

type ItemData = {
    text: string,
    completed: boolean
}

type ListProps = {
    title: string,
    date: Date,
    items: Array<ItemData>
}

type ListItem = {
    text: string,
    completed: boolean,
    key: string
}

const KEY_LEN = 8
const getBlankItem = () => {
    return {
        text: '',
        completed: false,
        key: getKey(KEY_LEN)
    }
}

const List: FC<ListProps> = props => {
    const [itemState, setItemState] = useState<Array<ListItem>>(props.items.map((data: ItemData) => {
        return {
            text: data.text,
            completed: data.completed,
            key: getKey(KEY_LEN)
        }
    }))

    const setItemText = (val: string, i: number) => {
        const state = [...itemState]
        state[i].text = val
        setItemState(state)
    }

    const setItemCompleted = (val: boolean, i: number) => {
        const state = [...itemState]
        state[i].completed = val
        setItemState(state)
    }

    const addItem = (i: number) => {
        const state = [...itemState.slice(0, i + 1), getBlankItem(), ...itemState.slice(i + 1)]
        setItemState(state)
    }

    const removeItem = (i: number) => {
        const state = [...itemState]
        const { key } = state.splice(i, 1)[0]
        removeKey(key)
        if (state.length === 0) {
            state.push(getBlankItem())
        }
        setItemState(state)
    }

    return (
        <section>
            <input type="text" defaultValue={props.title} />
            <div>{
                itemState.map((item: ListItem, i: number) => {
                    return <Item
                        text={item.text}
                        completed={item.completed}
                        key={item.key}
                        setText={(val: string) => setItemText(val, i)}
                        setCompleted={(val: boolean) => setItemCompleted(val, i)}
                        addItem={() => addItem(i)}
                        removeItem={() => removeItem(i)}
                    />
                })
            }</div>
        </section>
    )
}

export default List
