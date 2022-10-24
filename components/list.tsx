import React, { FC, useState, useEffect } from 'react'
import { ItemData } from '../lib/types'
import Item from './item'
import { getKey, removeKey } from '../lib/key'
import { arrayEqual } from '../lib/array'
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

const List: FC<ListProps> = props => {
    const [itemState, setItemState] = useState<Array<ListItem>>(props.items.map(dataToItem))
    const [title, setTitle] = useState<string>(props.title)
    const [focusInd, setFocusInd] = useState<Array<number>>([0])

    useEffect(() => {
        window.addEventListener('keydown', keyHandler)
        return () => {
            window.removeEventListener('keydown', keyHandler)
        }
    }, [focusInd, itemState])

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

    const decrementFocus = () => {
        let focus = [...focusInd]
        focus[focus.length - 1] -= 1
        if (focus[focus.length - 1] < 0) {
            focus.pop()
        } else {
            let item = getItem(itemState, focus)
            while (item.children.length > 0) {
                const ind = item.children.length - 1
                focus.push(ind)
                item = item.children[ind]
            }
        }
        if (focus.length === 0) {
            focus = [0]
        }
        setFocusInd(focus)
    }

    const incrementFocus = () => {
        let focus = [...focusInd]
        const item = getItem(itemState, focus)
        if (item.children.length > 0) {
            focus.push(0)
        } else {
            focus[focus.length - 1] += 1
            let arr = getArr(itemState, focus)
            while (focus[focus.length - 1] >= arr.length) {
                focus.pop()
                if (focus.length === 0) {
                    focus = [...focusInd]
                    break
                }
                focus[focus.length - 1] += 1
                arr = getArr(itemState, focus)
            }
        }
        setFocusInd(focus)
    }

    const decrementIndent = () => {
        const state = [...itemState]
        const focus = [...focusInd]
        if (focus.length <= 1) {
            return
        }
        const parentArr = getArr(state, focus.slice(0, -1))
        const thisArr = parentArr[focus[focus.length - 2]].children
        const item = thisArr.splice(focus[focus.length - 1], 1)[0]
        focus.pop()
        focus[focus.length - 1] += 1
        parentArr.splice(focus[focus.length - 1], 0, item)
        setItemState(state)
        setFocusInd(focus)
    }

    const incrementIndent = () => {
        const state = [...itemState]
        const focus = [...focusInd]
        const arr = getArr(state, focus)
        if (arr.length <= 1 || focus[focus.length - 1] === 0) {
            return
        }
        const item = arr.splice(focus[focus.length - 1], 1)[0]
        focus[focus.length - 1] -= 1
        const len = arr[focus[focus.length - 1]].children.push(item)
        focus.push(len - 1)
        setItemState(state)
        setFocusInd(focus)
    }

    const keyHandler = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp': {
                e.preventDefault()
                decrementFocus()
                break
            }
            case 'ArrowDown': {
                e.preventDefault()
                incrementFocus()
                break
            }
            case 'Tab': {
                e.preventDefault()
                if (e.shiftKey) {
                    decrementIndent()
                } else {
                    incrementIndent()
                }
                break
            }
        }
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
