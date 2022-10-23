import React, { FC, useEffect, useRef } from 'react'
import styles from '../styles/Item.module.css'

type ItemProps = {
    text: string,
    completed: boolean,
    focus: boolean,
    setText: (value: string) => void,
    setCompleted: (value: boolean) => void,
    addItem: () => void,
    removeItem: () => void,
    setFocus: () => void
}

const Item: FC<ItemProps> = props => {
    const textRef = useRef<HTMLInputElement>(null)

    const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setText(e.target.value)
    }

    const toggleCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setCompleted(e.target.checked)
    }

    const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            props.addItem()
        } else if ((props.text.length === 0 && e.key === 'Backspace') || e.key === 'Delete') {
            props.removeItem()
        }
    }

    useEffect(() => {
        if (props.focus) {
            textRef.current?.focus()
        }
    }, [props.focus])

    return (
        <div className={styles.itemContainer}>
            <input type="checkbox" defaultChecked={props.completed} onChange={toggleCompleted}/>
            <input type="text" ref={textRef} defaultValue={props.text} onChange={changeText} onKeyDown={keyHandler} onMouseDown={props.setFocus} />
        </div>
    )
}

export default Item
