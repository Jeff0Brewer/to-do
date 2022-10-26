let keys = new Set()
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const KEY_LEN = 8

const getKey = () => {
    let key = ''
    for (let i = 0; i < KEY_LEN; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    if (keys.has(key)) {
        key = getKey()
    }
    return key
}

const removeKey = (key: string) => {
    keys.delete(key)
}

const clearKeys = () => {
    keys = new Set()
}

export {
    getKey,
    removeKey,
    clearKeys
}
