import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import type { ListData, ListBlob } from '../../lib/types'

const listBlobToData = (blob: ListBlob) => {
    const data: ListData = {
        title: blob.title,
        key: blob.key,
        date: blob.date,
        items: JSON.parse(blob.items.toString('utf8'))
    }
    return data
}

const prisma = new PrismaClient()

const getLists = async (req: NextApiRequest, res: NextApiResponse<Array<ListData>>) => {
    const blobs: Array<ListBlob> = await prisma.list.findMany()
    const data: Array<ListData> = blobs.map(blob => listBlobToData(blob))
    res.status(200).send(data)
}

export default getLists
