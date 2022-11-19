import React, { FC } from 'react'
import { signIn } from 'next-auth/react'
import styles from '../styles/SignIn.module.css'

const SignIn: FC<Record<string, never>> = () => {
    return (
        <section className={styles.center}>
            <div className={styles.wrap}>
                <h1 className={styles.header}>To Do</h1>
                <p className={styles.subheader}>A minimal to do list app.</p>
                <button className={styles.signIn} onClick={() => signIn('google')}>log in</button>
            </div>
        </section>
    )
}

export default SignIn
