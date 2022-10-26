import React, { FC, useState, useEffect, useRef } from 'react'
import { ListData, ItemData } from '../lib/types'
import Item from './item'
import { getKey } from '../lib/key'
import { arrayEqual, arrayIndexOf } from '../lib/array'
import styles from '../styles/List.module.css'

const getBlankItem = () => {
    const item: ItemData = {
        text: '',
        completed: false,
        key: getKey(),
        children: []
    }
    return item
}

const getItem = (state: ListData, inds: Array<number>) => {
    let item = state.items[inds[0]]
    for (let i = 1; i < inds.length; i++) {
        item = item.children[inds[i]]
    }
    return item
}

const getSiblings = (state: ListData, inds: Array<number>) => {
    if (inds.length === 1) {
        return state.items
    }
    let arr = state.items[inds[0]].children
    for (let i = 1; i < inds.length - 1; i++) {
        arr = arr[inds[i]].children
    }
    return arr
}

const getTotalChildren = (item: ItemData) => {
    let count = item.children.length
    item.children.forEach(child => {
        count += getTotalChildren(child)
    })
    return count
}

type ListProps = {
    lists: Array<ListData>,
    setLists: (lists: Array<ListData>) => void,
    listInd: number
}

const List: FC<ListProps> = props => {
    const [focusArrs, setFocusArrs] = useState<Array<Array<number>>>([[0]])
    const [focusInd, setFocusInd] = useState<number>(0)
    const focusCheckRef = useRef<boolean>(true)
    const titleRef = useRef<HTMLInputElement>(null)

    const getFocusArrs = (item: ItemData, itemInd: Array<number>) => {
        const inds = []
        inds.push(itemInd)
        item.children.forEach((child, i) => {
            inds.push(...getFocusArrs(child, [...itemInd, i]))
        })
        return inds
    }

    useEffect(() => {
        const inds: Array<Array<number>> = []
        props.lists[props.listInd].items.forEach((item, i) => {
            inds.push(...getFocusArrs(item, [i]))
        })
        setFocusArrs(inds)
        focusCheckRef.current = true
        if (titleRef.current) {
            titleRef.current.value = props.lists[props.listInd].title
        }
    }, [props.lists, props.listInd])

    useEffect(() => {
        window.addEventListener('keydown', keyHandler)
        return () => {
            window.removeEventListener('keydown', keyHandler)
        }
    }, [focusArrs, focusInd])

    const updateItems = (state: Array<ListData>) => {
        const lists = [...props.lists]
        lists[props.listInd].items = state[props.listInd].items
        props.setLists(lists)
    }

    const updateTitle = (title: string) => {
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
        const arr = getSiblings(state[props.listInd], inds)
        arr.splice(inds[inds.length - 1] + 1, 0, getBlankItem())
        updateItems(state)
        setFocusInd(focusInd + 1)
    }

    const removeItem = (inds: Array<number>) => {
        const state = [...props.lists]
        const arr = getSiblings(state[props.listInd], inds)
        arr.splice(inds[inds.length - 1], 1)
        if (arr.length === 0) {
            arr.push(getBlankItem())
        }
        updateItems(state)
        setFocusInd(focusInd - 1)
    }

    const decrementIndent = () => {
        if (focusArrs[focusInd].length <= 1 || focusInd === 0) { return }
        const state = [...props.lists]
        const itemFocus = focusArrs[focusInd]
        let parentInd = focusInd - 1
        while (focusArrs[parentInd].length >= itemFocus.length) {
            parentInd -= 1
        }
        const siblings = getSiblings(state[props.listInd], itemFocus)
        const item = siblings.splice(itemFocus[itemFocus.length - 1], 1)[0]
        const parentFocus = focusArrs[parentInd]
        const parentSiblings = getSiblings(state[props.listInd], focusArrs[parentInd])
        parentSiblings.splice(parentFocus[parentFocus.length - 1] + 1, 0, item)
        updateItems(state)
        setFocusInd(parentInd + getTotalChildren(getItem(state[props.listInd], parentFocus)) + 1)
        focusCheckRef.current = false
    }

    const incrementIndent = () => {
        if (focusInd === 0) {
            return
        }
        const state = [...props.lists]
        const itemFocus = focusArrs[focusInd]
        let siblingAboveInd = focusInd - 1
        while (focusArrs[siblingAboveInd].length !== itemFocus.length) {
            if (focusArrs[siblingAboveInd].length < itemFocus.length || siblingAboveInd === 0) {
                return
            }
            siblingAboveInd -= 1
        }
        const siblings = getSiblings(state[props.listInd], itemFocus)
        const item = siblings.splice(itemFocus[itemFocus.length - 1], 1)[0]
        const siblingAbove = getItem(state[props.listInd], focusArrs[siblingAboveInd])
        siblingAbove.children.push(item)
        updateItems(state)
        setFocusInd(siblingAboveInd + getTotalChildren(siblingAbove) - getTotalChildren(item))
        focusCheckRef.current = false
    }

    const keyHandler = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp': {
                e.preventDefault()
                setFocusInd(Math.max(focusInd - 1, 0))
                break
            }
            case 'ArrowDown': {
                e.preventDefault()
                setFocusInd(Math.min(focusInd + 1, focusArrs.length - 1))
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

    const itemToComponents = (item: ItemData, focusArr: Array<number>) => {
        const component = <Item
            text={item.text}
            completed={item.completed}
            focus={focusCheckRef.current && arrayEqual(focusArrs[focusInd], focusArr)}
            key={item.key}
            setText={(val: string) => setItemText(val, focusArr)}
            setCompleted={(val: boolean) => setItemCompleted(val, focusArr)}
            addItem={() => addItem(focusArr)}
            removeItem={() => removeItem(focusArr)}
            setFocus={() => setFocusInd(arrayIndexOf(focusArrs, focusArr))}
        />
        if (!item.children) {
            return component
        }
        const children: Array<React.ReactElement> = []
        item.children.forEach((child: ItemData, i: number) => {
            children.push(itemToComponents(child, [...focusArr, i]))
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
                    defaultValue={props.lists[props.listInd].title}
                    onChange={e => updateTitle(e.target.value)}
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
