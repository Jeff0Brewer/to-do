import { ListData, ListBlob, ListRes, ItemData } from './types'
import { getKey } from './key'

const getBlankItem = () => {
    const item: ItemData = {
        text: '',
        completed: false,
        key: getKey(),
        children: []
    }
    return item
}

const getBlankList = () => {
    const list: ListData = {
        title: '',
        date: new Date(),
        items: [
            getBlankItem()
        ],
        key: getKey()
    }
    return list
}

const getItem = (state: ListData, inds: Array<number>) => {
    let item = state.items[inds[0]]
    for (let i = 1; i < inds.length; i++) {
        item = item.children[inds[i]]
    }
    return item
}

const getSiblings = (state: ListData, inds: Array<number>) => {
    if (inds.length === 1) {
        return state.items
    }
    let arr = state.items[inds[0]].children
    for (let i = 1; i < inds.length - 1; i++) {
        arr = arr[inds[i]].children
    }
    return arr
}

const getTotalChildren = (item: ItemData) => {
    let count = item.children.length
    item.children.forEach(child => {
        count += getTotalChildren(child)
    })
    return count
}

const getFocusArr = (item: ItemData, itemInd: Array<number>) => {
    const inds: Array<Array<number>> = []
    inds.push(itemInd)
    item.children.forEach((child, i) => {
        inds.push(...getFocusArr(child, [...itemInd, i]))
    })
    return inds
}

const getFocusArrs = (items: Array<ItemData>) => {
    const inds: Array<Array<number>> = []
    items.forEach((item, i) => {
        inds.push(...getFocusArr(item, [i]))
    })
    return inds
}

const listBlobToData = (blob: ListBlob) => {
    const data: ListData = {
        key: blob.key,
        title: blob.title,
        date: blob.date,
        items: JSON.parse(blob.items.toString('utf8'))
    }
    return data
}

const listResToBlob = (res: ListRes) => {
    const blob: ListBlob = {
        key: res.key,
        title: res.title,
        date: new Date(Date.parse(res.date)),
        items: Buffer.from(JSON.stringify(res.items), 'utf8')
    }
    return blob
}

const listResToData = (res: ListRes) => {
    const data: ListData = {
        key: res.key,
        title: res.title,
        items: res.items,
        date: new Date(Date.parse(res.date))
    }
    return data
}

export {
    getBlankItem,
    getBlankList,
    getItem,
    getSiblings,
    getTotalChildren,
    getFocusArrs,
    listBlobToData,
    listResToBlob,
    listResToData
}
