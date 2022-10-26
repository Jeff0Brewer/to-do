import React, { FC, useState, useEffect, useRef } from 'react'
import { ListData, ItemData } from '../lib/types'
import Item from './item'
import { arrayIndexOf } from '../lib/array'
import { getBlankItem, getItem, getSiblings, getTotalChildren, getFocusArrs } from '../lib/list-util'
import styles from '../styles/List.module.css'

type ListProps = {
    lists: Array<ListData>,
    setLists: (lists: Array<ListData>) => void,
    listInd: number
}

const List: FC<ListProps> = props => {
    const [focusArrs, setFocusArrs] = useState<Array<Array<number>>>([[0]])
    const [focusInd, setFocusInd] = useState<number>(-1)
    const titleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setFocusArrs(getFocusArrs(props.lists[props.listInd].items))
        if (titleRef.current) {
            titleRef.current.value = props.lists[props.listInd].title
        }
    }, [props.lists, props.listInd])

    useEffect(() => {
        if (focusInd === -1 && titleRef.current) {
            titleRef.current.focus()
        }
        window.addEventListener('keydown', keyHandler)
        return () => {
            window.removeEventListener('keydown', keyHandler)
        }
    }, [focusArrs, focusInd])

    useEffect(() => {
        setFocusInd(-1)
    }, [props.lists.length, props.listInd])

    const updateTitle = (title: string) => {
        const lists = [...props.lists]
        lists[props.listInd].title = title
        props.setLists(lists)
    }

    const setItemText = (val: string, inds: Array<number>) => {
        const state = [...props.lists]
        const item = getItem(state[props.listInd], inds)
        item.text = val
        props.setLists(state)
    }

    const setItemCompleted = (val: boolean, inds: Array<number>) => {
        const state = [...props.lists]
        const item = getItem(state[props.listInd], inds)
        item.completed = val
        props.setLists(state)
    }

    const addItem = (inds: Array<number>) => {
        const state = [...props.lists]
        const arr = getSiblings(state[props.listInd], inds)
        arr.splice(inds[inds.length - 1] + 1, 0, getBlankItem())
        props.setLists(state)
        setFocusInd(focusInd + 1)
    }

    const removeItem = (inds: Array<number>) => {
        const state = [...props.lists]
        const arr = getSiblings(state[props.listInd], inds)
        arr.splice(inds[inds.length - 1], 1)
        if (arr.length === 0) {
            arr.push(getBlankItem())
        }
        props.setLists(state)
        setFocusInd(focusInd - 1)
    }

    const decrementIndent = () => {
        if (focusInd <= 0 || focusArrs[focusInd].length <= 1) { return }
        const state = [...props.lists]
        const itemFocus = focusArrs[focusInd]
        let parentInd = focusInd - 1
        while (focusArrs[parentInd].length >= itemFocus.length) {
            parentInd -= 1
        }
        const parentFocus = focusArrs[parentInd]
        const siblings = getSiblings(state[props.listInd], itemFocus)
        const item = siblings.splice(itemFocus[itemFocus.length - 1], 1)[0]
        const parentSiblings = getSiblings(state[props.listInd], parentFocus)
        const parent = getItem(state[props.listInd], parentFocus)
        parentSiblings.splice(parentFocus[parentFocus.length - 1] + 1, 0, item)
        props.setLists(state)
        setFocusInd(parentInd + getTotalChildren(parent) + 1)
        setFocusArrs(getFocusArrs(state[props.listInd].items))
    }

    const incrementIndent = () => {
        if (focusInd <= 0 || focusArrs[focusInd].length > 10) { return }
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
        props.setLists(state)
        setFocusInd(siblingAboveInd + getTotalChildren(siblingAbove) - getTotalChildren(item))
        setFocusArrs(getFocusArrs(state[props.listInd].items))
    }

    const keyHandler = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp': {
                e.preventDefault()
                setFocusInd(Math.max(focusInd - 1, -1))
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
        const thisFocusInd = arrayIndexOf(focusArrs, focusArr)
        const component = <Item
            text={item.text}
            completed={item.completed}
            focus={thisFocusInd === focusInd}
            key={item.key}
            setText={(val: string) => setItemText(val, focusArr)}
            setCompleted={(val: boolean) => setItemCompleted(val, focusArr)}
            addItem={() => addItem(focusArr)}
            removeItem={() => removeItem(focusArr)}
            setFocus={() => setFocusInd(thisFocusInd)}
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
                    onClick={() => setFocusInd(-1)}
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
