import { ListData, ItemData } from './types'
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
    return {
        title: '',
        date: new Date(),
        items: [
            getBlankItem()
        ],
        key: getKey()
    }
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

export {
    getBlankItem,
    getBlankList,
    getItem,
    getSiblings,
    getTotalChildren
}
