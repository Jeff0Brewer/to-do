import React, { FC, useState, useEffect } from 'react'
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
    const [title, setTitle] = useState<string>(props.title)
    const [itemState, setItemState] = useState<Array<ListItem>>(props.items.map((data: ItemData) => {
        return {
            text: data.text,
            completed: data.completed,
            key: getKey(KEY_LEN)
        }
    }))
    const [focusInd, setFocusInd] = useState<number>(0)

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
        setFocusInd(focusInd + 1)
    }

    const removeItem = (i: number) => {
        const state = [...itemState]
        const removed = state.splice(i, 1)[0]
        if (state.length === 0) {
            state.push(getBlankItem())
        }
        setItemState(state)
        setFocusInd(Math.max(focusInd - 1, 0))
        removeKey(removed.key)
    }

    useEffect(() => {
        const keyHandler = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault()
                    setFocusInd(Math.max(focusInd - 1, 0))
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    setFocusInd(Math.min(focusInd + 1, itemState.length - 1))
                    break
            }
        }
        window.addEventListener('keydown', keyHandler)
        return () => {
            window.removeEventListener('keydown', keyHandler)
        }
    }, [focusInd, itemState])

    return (
        <section>
            <input
                type="text"
                defaultValue={title}
                onChange={e => setTitle(e.target.value)}
            />
            <div>{
                itemState.map((item: ListItem, i: number) => {
                    return <Item
                        text={item.text}
                        completed={item.completed}
                        focus={focusInd === i}
                        key={item.key}
                        setText={(val: string) => setItemText(val, i)}
                        setCompleted={(val: boolean) => setItemCompleted(val, i)}
                        addItem={() => addItem(i)}
                        removeItem={() => removeItem(i)}
                        setFocus={() => setFocusInd(i)}
                    />
                })
            }</div>
        </section>
    )
}

export default List
