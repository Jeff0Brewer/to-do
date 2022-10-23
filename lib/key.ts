const keys = new Set()
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const getKey = (len: number) => {
    let key = ''
    for (let i = 0; i < len; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    if (keys.has(key)) {
        key = getKey(len)
    }
    return key
}

const removeKey = (key: string) => {
    keys.delete(key)
}

export {
    getKey,
    removeKey
}
