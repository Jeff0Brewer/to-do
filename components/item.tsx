import React, { FC } from 'react'
import styles from '../styles/Item.module.css'

type ItemProps = {
    text: string,
    completed: boolean,
    setText: (value: string) => void,
    setCompleted: (value: boolean) => void
}

const Item: FC<ItemProps> = props => {
    const toggleCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setCompleted(e.target.checked)
    }

    const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setText(e.target.value)
    }

    return (
        <div className={styles.itemContainer}>
            <input type="checkbox" defaultChecked={props.completed} onChange={toggleCompleted}/>
            <input type="text" defaultValue={props.text} onChange={changeText} />
        </div>
    )
}

export default Item
