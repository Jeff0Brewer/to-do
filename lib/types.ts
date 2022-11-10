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

export type {
    ItemData,
    ListData,
    ListBlob,
    ListRes
}
