const arrayEqual = (a: Array<any>, b: Array<any>) => {
    if (a === b) { return true }
    if (a.length !== b.length) { return false }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false
        }
    }
    return true
}

const arrayIndexOf = (a: Array<Array<any>>, b: Array<any>) => {
    for (let i = 0; i < a.length; i++) {
        if (arrayEqual(a[i], b)) {
            return i
        }
    }
    return -1
}

export {
    arrayEqual,
    arrayIndexOf
}
