import React, { FC, useState } from 'react'
import styles from '../styles/Item.module.css'

type ItemProps = {
    text: string,
    completed: boolean,
    setText: (value: string) => void,
    setCompleted: (value: boolean) => void,
    addItem: () => void,
    removeItem: () => void
}

const Item: FC<ItemProps> = props => {
    const [textEmpty, setTextEmpty] = useState<boolean>(!props.text)

    const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setText(e.target.value)
        setTextEmpty(!e.target.value)
    }

    const toggleCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setCompleted(e.target.checked)
    }

    const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            props.addItem()
        } else if ((textEmpty && e.key === 'Backspace') || e.key === 'Delete') {
            props.removeItem()
        }
    }

    return (
        <div className={styles.itemContainer}>
            <input type="checkbox" defaultChecked={props.completed} onChange={toggleCompleted}/>
            <input type="text" defaultValue={props.text} onChange={changeText} onKeyDown={keyHandler} />
        </div>
    )
}

export default Item
