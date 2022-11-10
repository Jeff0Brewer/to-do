import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const isItemData = (obj: any) => {
    return (
        obj &&
        typeof obj?.key === 'string' &&
        typeof obj?.text === 'string' &&
        typeof obj?.completed === 'boolean' &&
        Array.isArray(obj?.children) &&
        obj.children.reduce((allItems: boolean, obj: any) => {
            return allItems && isItemData(obj)
        }, true)
    )
}

const isListData = (obj: any) => {
    return (
        typeof obj?.key === 'string' &&
        typeof obj?.title === 'string' &&
        obj?.date instanceof Date &&
        isItemData(obj?.items)
    )
}

const prisma = new PrismaClient()

const createList = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST' || !isListData(req.body?.list)) {
        res.status(405).send({ message: 'must send list in POST request' })
        return
    }
    await prisma.list.create({
        data: req.body.list
    })
    res.status(200).send({ message: 'list created' })
}

export default createList
