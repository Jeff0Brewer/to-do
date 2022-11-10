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

export type {
    ItemData,
    ListData,
    ListBlob
}
