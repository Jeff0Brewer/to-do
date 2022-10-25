import React, { FC } from 'react'
import styles from '../styles/LabelButton.module.css'

type LabelButtonProps = {
    symbol: React.ReactElement,
    text: string,
    onClick: () => void
}

const LabelButton: FC<LabelButtonProps> = props => {
    return (
        <button className={styles.button} onClick={props.onClick}>
            <p className={styles.symbol}>{props.symbol}</p>
            <p className={styles.text}>{props.text}</p>
        </button>
    )
}

export default LabelButton
