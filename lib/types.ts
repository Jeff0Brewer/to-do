type ItemData = {
    text: string,
    completed: boolean,
    key?: string,
    children?: Array<ItemData>
}

type ListData = {
    title: string,
    date: Date,
    items: Array<ItemData>
}

export type {
    ItemData,
    ListData
}
