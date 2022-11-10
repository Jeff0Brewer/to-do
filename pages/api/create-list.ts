import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { listResToBlob } from '../../lib/list-util'

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

const prisma = new PrismaClient()

const createList = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST' || !isListRes(req.body?.list)) {
        res.status(405).send({ message: 'must send list in POST request' })
        return
    }
    const blob = listResToBlob(req.body.list)
    try {
        await prisma.list.create({
            data: blob
        })
        res.status(200).send({ message: 'list created' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'list creation failed' })
    }
}

export default createList
