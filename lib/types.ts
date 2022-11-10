type ItemData = {
    text: string,
    completed: boolean,
    children: Array<ItemData>,
    key: string
}

type ListData = {
    title: string,
    date: Date,
    items: Array<ItemData>,
    key: string
}

type ListBlob = {
    title: string,
    date: Date,
    items: Buffer,
    key: string
}

type ListRes = {
    title: string,
    date: string,
    key: string,
    items: Array<ItemData>
}

const checkArray = (arr: any, check: (val: any) => boolean) => {
    return (
        Array.isArray(arr) &&
        arr.reduce((allTrue: boolean, val: any) => {
            return allTrue && check(val)
        }, true)
    )
}

const isItemData = (obj: any) => {
    return (
        obj &&
        typeof obj?.key === 'string' &&
        typeof obj?.text === 'string' &&
        typeof obj?.completed === 'boolean' &&
        checkArray(obj?.children, isItemData)
    )
}

const isListRes = (obj: any) => {
    return (
        typeof obj?.key === 'string' &&
        typeof obj?.title === 'string' &&
        typeof obj?.date === 'string' &&
        checkArray(obj?.items, isItemData)
    )
}

export {
    isItemData,
    isListRes
}

export type {
    ItemData,
    ListData,
    ListBlob,
    ListRes
}
