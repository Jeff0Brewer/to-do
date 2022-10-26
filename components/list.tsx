import React, { FC, useState, useEffect, useRef } from 'react'
import { ListData, ItemData } from '../lib/types'
import Item from './item'
import { getKey } from '../lib/key'
import { arrayEqual } from '../lib/array'
import styles from '../styles/List.module.css'

const getBlankItem = () => {
    return {
        text: '',
        completed: false,
        key: getKey(),
        children: []
    }
}

const getItem = (state: ListData, inds: Array<number>) => {
    let item = state.items[inds[0]]
    for (let i = 1; i < inds.length; i++) {
        item = item.children[inds[i]]
    }
    return item
}

const getArr = (state: ListData, inds: Array<number>) => {
    if (inds.length === 1) {
        return state.items
    }
    let arr = state.items[inds[0]].children
    for (let i = 1; i < inds.length - 1; i++) {
        arr = arr[inds[i]].children
    }
    return arr
}

type ListProps = {
    lists: Array<ListData>,
    setLists: (lists: Array<ListData>) => void,
    listInd: number
}

const List: FC<ListProps> = props => {
    const [title, setTitle] = useState<string>(props.lists[props.listInd].title)
    const [focusInd, setFocusInd] = useState<Array<number>>([])
    const titleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setTitle(props.lists[props.listInd].title)
        if (titleRef.current) {
            titleRef.current.value = props.lists[props.listInd].title
        }
    }, [props.lists, props.listInd])

    useEffect(() => {
        window.addEventListener('keydown', keyHandler)
        return () => {
            window.removeEventListener('keydown', keyHandler)
        }
    }, [focusInd, props.lists])

    const updateItems = (state: Array<ListData>) => {
        const lists = [...props.lists]
        lists[props.listInd].items = state[props.listInd].items
        props.setLists(lists)
    }

    const updateTitle = (title: string) => {
        setFocusInd([])
        setTitle(title)
        const lists = [...props.lists]
        lists[props.listInd].title = title
        props.setLists(lists)
    }

    const setItemText = (val: string, inds: Array<number>) => {
        const state = [...props.lists]
        const item = getItem(state[props.listInd], inds)
        item.text = val
        updateItems(state)
    }

    const setItemCompleted = (val: boolean, inds: Array<number>) => {
        const state = [...props.lists]
        const item = getItem(state[props.listInd], inds)
        item.completed = val
        updateItems(state)
    }

    const addItem = (inds: Array<number>) => {
        const state = [...props.lists]
        const arr = getArr(state[props.listInd], inds)
        arr.splice(inds[inds.length - 1] + 1, 0, getBlankItem())

        const focus = [...focusInd]
        focus[focus.length - 1] += 1

        updateItems(state)
        setFocusInd(focus)
    }

    const removeItem = (inds: Array<number>) => {
        const state = [...props.lists]
        const arr = getArr(state[props.listInd], inds)
        arr.splice(inds[inds.length - 1], 1)
        if (arr.length === 0) {
            arr.push(getBlankItem())
        }

        let focus = [...focusInd]
        if (arr.length === 0) {
            focus = focus.slice(0, -1)
        } else {
            focus[focus.length - 1] = Math.max(0, focus[focus.length - 1] - 1)
        }

        updateItems(state)
        setFocusInd(focus)
    }

    const decrementFocus = () => {
        if (!focusInd.length) { return }
        let focus = [...focusInd]
        focus[focus.length - 1] -= 1
        if (focus[focus.length - 1] < 0) {
            focus.pop()
        } else {
            let item = getItem(props.lists[props.listInd], focus)
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
        if (!focusInd.length) {
            setFocusInd([0])
            return
        }
        let focus = [...focusInd]
        const item = getItem(props.lists[props.listInd], focus)
        if (item.children.length > 0) {
            focus.push(0)
            setFocusInd(focus)
            return
        }
        focus[focus.length - 1] += 1
        let arr = getArr(props.lists[props.listInd], focus)
        while (focus[focus.length - 1] >= arr.length) {
            focus.pop()
            if (focus.length === 0) {
                focus = [...focusInd]
                break
            }
            focus[focus.length - 1] += 1
            arr = getArr(props.lists[props.listInd], focus)
        }
        setFocusInd(focus)
    }

    const decrementIndent = () => {
        const state = [...props.lists]
        const focus = [...focusInd]
        if (focus.length <= 1) {
            return
        }
        const parentArr = getArr(state[props.listInd], focus.slice(0, -1))
        const thisArr = parentArr[focus[focus.length - 2]].children
        const item = thisArr.splice(focus[focus.length - 1], 1)[0]
        focus.pop()
        focus[focus.length - 1] += 1
        parentArr.splice(focus[focus.length - 1], 0, item)

        updateItems(state)
        setFocusInd(focus)
    }

    const incrementIndent = () => {
        const state = [...props.lists]
        const focus = [...focusInd]
        const arr = getArr(state[props.listInd], focus)
        if (arr.length <= 1 || focus[focus.length - 1] === 0) {
            return
        }
        const item = arr.splice(focus[focus.length - 1], 1)[0]
        focus[focus.length - 1] -= 1
        const len = arr[focus[focus.length - 1]].children.push(item)
        focus.push(len - 1)

        updateItems(state)
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

    const itemToComponents = (item: ItemData, inds: Array<number>) => {
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
        item.children.forEach((child: ItemData, i: number) => {
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
        <div className={styles.listWrap}>
            <section className={styles.list}>
                <input
                    className={styles.title}
                    ref={titleRef}
                    type="text"
                    placeholder="title..."
                    defaultValue={title}
                    onChange={e => updateTitle(e.target.value)}
                    onMouseDown={() => setFocusInd([])}
                />
                <div>{
                    props.lists[props.listInd].items.map((item: ItemData, i: number) => {
                        return itemToComponents(item, [i])
                    })
                }</div>
            </section>
        </div>
    )
}

export default List
