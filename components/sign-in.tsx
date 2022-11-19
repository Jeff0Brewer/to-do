import React, { FC } from 'react'
import { signIn } from 'next-auth/react'

const SignIn: FC<Record<string, never>> = () => {
    return (
        <button onClick={() => signIn()}>sign in</button>
    )
}

export default SignIn
