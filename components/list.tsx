import React, { FC, useState, useEffect } from 'react'
import { ItemData } from '../lib/types'
import Item from './item'
import { getKey, removeKey } from '../lib/key'
import styles from '../styles/List.module.css'

type ListItem = {
    text: string,
    completed: boolean,
    key: string,
    children: Array<ListItem>
}

type ListProps = {
    title: string,
    date: Date,
    items: Array<ItemData>
}

const arrayEqual = (a: Array<any>, b: Array<any>) => {
    if (a === b) { return true }
    if (a.length !== b.length) { return false }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false
        }
    }
    return true
}

const KEY_LEN = 8
const getBlankItem = () => {
    return {
        text: '',
        completed: false,
        key: getKey(KEY_LEN),
        children: []
    }
}

const getItem = (state: Array<ListItem>, inds: Array<number>) => {
    let item = state[inds[0]]
    for (let i = 1; i < inds.length; i++) {
        item = item.children[inds[i]]
    }
    return item
}

const getArr = (state: Array<ListItem>, inds: Array<number>) => {
    if (inds.length === 1) {
        return state
    }
    let arr = state[inds[0]].children
    for (let i = 1; i < inds.length - 1; i++) {
        arr = arr[inds[i]].children
    }
    return arr
}

const List: FC<ListProps> = props => {
    const dataToItem = (data: ItemData) => {
        const children: Array<ListItem> = []
        if (data?.children) {
            data.children.forEach((child: ItemData) => {
                children.push(dataToItem(child))
            })
        }
        return {
            text: data.text,
            completed: data.completed,
            key: getKey(KEY_LEN),
            children
        }
    }
    const [itemState, setItemState] = useState<Array<ListItem>>(props.items.map(dataToItem))
    const [title, setTitle] = useState<string>(props.title)
    const [focusInd, setFocusInd] = useState<Array<number>>([0])
    useEffect(() => {
        console.log(itemState)
    }, [itemState])

    const setItemText = (val: string, inds: Array<number>) => {
        const state = [...itemState]
        const item = getItem(state, inds)
        item.text = val
        setItemState(state)
    }

    const setItemCompleted = (val: boolean, inds: Array<number>) => {
        const state = [...itemState]
        const item = getItem(state, inds)
        item.completed = val
        setItemState(state)
    }

    const addItem = (inds: Array<number>) => {
        const state = [...itemState]
        const arr = getArr(state, inds)
        arr.splice(inds[inds.length - 1] + 1, 0, getBlankItem())

        const focus = [...focusInd]
        focus[focus.length - 1] += 1

        setItemState(state)
        setFocusInd(focus)
    }

    const removeItem = (inds: Array<number>) => {
        const state = [...itemState]
        const arr = getArr(state, inds)
        const removed = arr.splice(inds[inds.length - 1], 1)[0]
        if (state.length === 0) {
            state.push(getBlankItem())
        }

        let focus = [...focusInd]
        if (arr.length === 0) {
            focus = focus.slice(0, -1)
        } else {
            focus[focus.length - 1] = Math.max(0, focus[focus.length - 1] - 1)
        }

        setItemState(state)
        setFocusInd(focus)
        removeKey(removed.key)
    }

    const itemToComponents = (item: ListItem, inds: Array<number>) => {
        const component = <Item
            text={item.text}
            completed={item.completed}
            focus={arrayEqual(focusInd, inds)}
            key={item.key}
            setText={(val: string) => setItemText(val, inds)}
            setCompleted={(val: boolean) => setItemCompleted(val, inds)}
            addItem={() => addItem(inds)}
            removeItem={() => removeItem(inds)}
            setFocus={() => setFocusInd(inds)}
        />
        if (!item.children) {
            return component
        }
        const children: Array<React.ReactElement> = []
        item.children.forEach((child: ListItem, i: number) => {
            children.push(itemToComponents(child, [...inds, i]))
        })
        return (
            <div key={item.key + 'c'}>
                {component}
                <div key={item.key + 'ci'} className={styles.indent}>
                    {children}
                </div>
            </div>
        )
    }

    // useEffect(() => {
    //    const keyHandler = (e: KeyboardEvent) => {
    //        switch (e.key) {
    //            case 'ArrowUp':
    //                e.preventDefault()
    //                setFocusInd(Math.max(focusInd - 1, 0))
    //                break
    //            case 'ArrowDown':
    //                e.preventDefault()
    //                setFocusInd(Math.min(focusInd + 1, itemState.length - 1))
    //                break
    //        }
    //    }
    //    window.addEventListener('keydown', keyHandler)
    //    return () => {
    //        window.removeEventListener('keydown', keyHandler)
    //    }
    // }, [focusInd, itemState])

    return (
        <section className={styles.list}>
            <input
                className={styles.title}
                type="text"
                placeholder="title..."
                defaultValue={title}
                onChange={e => setTitle(e.target.value)}
            />
            <div>{
                itemState.map((item: ListItem, i: number) => {
                    return itemToComponents(item, [i])
                })
            }</div>
        </section>
    )
}

export default List
