type ItemData = {
    text: string,
    completed: boolean,
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
