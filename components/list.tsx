import React, { FC, useState, useEffect, useRef } from 'react'
import { ListData, ItemData } from '../lib/types'
import { arrayIndexOf, arrayEqual } from '../lib/array'
import { getBlankItem, getItem, getSiblings, getTotalChildren, getFocusArrs } from '../lib/list-util'
import { swipeStartHandler, swipeEndHandler } from '../lib/touch'
import Item from './item'
import styles from '../styles/List.module.css'

type ListProps = {
    list: ListData,
    setList: (data: ListData) => void
}

const List: FC<ListProps> = props => {
    const [focusArrs, setFocusArrs] = useState<Array<Array<number>>>([[0]])
    const [focusInd, setFocusInd] = useState<number>(-1)
    const titleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setFocusArrs(getFocusArrs(props.list.items))
        if (titleRef.current) {
            titleRef.current.value = props.list.title
        }
    }, [props.list])

    useEffect(() => {
        if (focusInd === -1 && titleRef.current) {
            titleRef.current.focus()
        }
        const swipeEnd = (e: TouchEvent) => { swipeEndHandler(e, decrementIndent, incrementIndent) }
        window.addEventListener('touchstart', swipeStartHandler)
        window.addEventListener('touchend', swipeEnd)
        window.addEventListener('keydown', keyHandler)
        return () => {
            window.removeEventListener('touchstart', swipeStartHandler)
            window.removeEventListener('touchend', swipeEnd)
            window.removeEventListener('keydown', keyHandler)
        }
    }, [focusArrs, focusInd])

    useEffect(() => {
        setFocusInd(-1)
    }, [props.list.key])

    const updateTitle = (title: string) => {
        const list = { ...props.list }
        list.title = title
        props.setList(list)
    }

    const setItemText = (val: string, inds: Array<number>) => {
        const list = { ...props.list }
        const item = getItem(list, inds)
        item.text = val
        props.setList(list)
    }

    const setItemCompleted = (val: boolean, inds: Array<number>) => {
        const list = { ...props.list }
        const item = getItem(list, inds)
        item.completed = val
        props.setList(list)
    }

    const addItem = (inds: Array<number>) => {
        if (props.list.items.length >= 100) { return }
        const list = { ...props.list }
        const item = getItem(list, inds)
        const siblings = getSiblings(list, inds)
        siblings.splice(inds[inds.length - 1] + 1, 0, getBlankItem())
        props.setList(list)
        setFocusInd(focusInd + getTotalChildren(item) + 1)
    }

    const removeItem = (inds: Array<number>) => {
        const list = { ...props.list }
        const arr = getSiblings(list, inds)
        arr.splice(inds[inds.length - 1], 1)
        if (inds.length === 1 && arr.length === 0) {
            arr.push(getBlankItem())
        }
        props.setList(list)
        setFocusInd(focusInd - 1)
    }

    const decrementIndent = () => {
        if (focusInd <= 0 || focusArrs[focusInd].length <= 1) { return }
        const list = { ...props.list }
        const itemFocus = focusArrs[focusInd]
        let parentInd = focusInd - 1
        while (focusArrs[parentInd].length >= itemFocus.length) {
            parentInd -= 1
        }
        const parentFocus = focusArrs[parentInd]
        const siblings = getSiblings(list, itemFocus)
        const item = siblings.splice(itemFocus[itemFocus.length - 1], 1)[0]
        const parentSiblings = getSiblings(list, parentFocus)
        const parent = getItem(list, parentFocus)
        parentSiblings.splice(parentFocus[parentFocus.length - 1] + 1, 0, item)
        props.setList(list)
        setFocusInd(parentInd + getTotalChildren(parent) + 1)
        setFocusArrs(getFocusArrs(list.items))
    }

    const incrementIndent = () => {
        const itemFocus = focusArrs[focusInd]
        const maxChildIndent = focusArrs
            .filter(arr => arrayEqual(itemFocus, arr.slice(0, itemFocus.length)))
            .reduce((p, c) => p > c.length ? p : c.length, 0)
        if (focusInd <= 0 || maxChildIndent > 10) { return }
        const list = { ...props.list }
        let siblingAboveInd = focusInd - 1
        while (focusArrs[siblingAboveInd].length !== itemFocus.length) {
            if (focusArrs[siblingAboveInd].length < itemFocus.length || siblingAboveInd === 0) {
                return
            }
            siblingAboveInd -= 1
        }
        const siblings = getSiblings(list, itemFocus)
        const item = siblings.splice(itemFocus[itemFocus.length - 1], 1)[0]
        const siblingAbove = getItem(list, focusArrs[siblingAboveInd])
        siblingAbove.children.push(item)
        props.setList(list)
        setFocusInd(siblingAboveInd + getTotalChildren(siblingAbove) - getTotalChildren(item))
        setFocusArrs(getFocusArrs(list.items))
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
                if (!focusArrs[focusInd]) {
                    break
                }
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
                    defaultValue={props.list.title}
                    onChange={e => updateTitle(e.target.value)}
                    onClick={() => setFocusInd(-1)}
                />
                <div>{
                    props.list.items.map((item: ItemData, i: number) => {
                        return itemToComponents(item, [i])
                    })
                }</div>
            </section>
        </div>
    )
}

export default List
