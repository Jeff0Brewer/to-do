import React, { FC } from 'react'
import { signIn } from 'next-auth/react'
import styles from '../styles/SignIn.module.css'

const SignIn: FC<Record<string, never>> = () => {
    return (
        <div>
            <section className={styles.header}>
                <h1 className={styles.title}>To Do</h1>
                <p className={styles.description}>A minimal to do list app.</p>
                <button className={styles.signIn} onClick={() => signIn('google')}>log in</button>
            </section>
            <section className={styles.demo}>
                <div className={styles.demoFade}>
                    <video className={styles.video} autoPlay muted loop playsInline>
                        <source src='./to-do-loop.mp4' type='video/mp4'/>
                    </video>
                </div>
            </section>
        </div>
    )
}

export default SignIn
