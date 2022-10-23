import React, { FC, useEffect, useRef } from 'react'
import styles from '../styles/List.module.css'

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
            e.preventDefault()
            props.addItem()
        } else if ((props.text.length === 0 && e.key === 'Backspace') || e.key === 'Delete') {
            e.preventDefault()
            props.removeItem()
        }
    }

    useEffect(() => {
        if (props.focus && textRef.current) {
            textRef.current.focus()
            const len = textRef.current.value.length
            textRef.current.setSelectionRange(len, len)
        }
    }, [props.focus])

    return (
        <div className={styles.itemContainer}>
            <input
                type="checkbox"
                defaultChecked={props.completed}
                onChange={toggleCompleted}
            />
            <input
                className={styles.itemText}
                type="text"
                placeholder="item..."
                ref={textRef}
                defaultValue={props.text}
                onChange={changeText}
                onKeyDown={keyHandler}
                onMouseDown={props.setFocus}
            />
        </div>
    )
}

export default Item
