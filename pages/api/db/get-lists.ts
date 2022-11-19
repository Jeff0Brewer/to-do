import type { NextApiRequest, NextApiResponse } from 'next'
import type { ListData, ListBlob } from '../../../lib/types'
import { listBlobToData } from '../../../lib/list-util'
import prisma from '../../../prisma/client'

type GetResponse = Array<ListData> | {
    message: string
}

const getLists = async (req: NextApiRequest, res: NextApiResponse<GetResponse>) => {
    if (req.method !== 'POST' || typeof req.body?.email !== 'string') {
        res.status(405).send({ message: 'must send user email in POST request' })
    }
    const blobs: Array<ListBlob> = await prisma.list.findMany({
        where: {
            userEmail: req.body.email
        }
    })
    const data: Array<ListData> = blobs.map(blob => listBlobToData(blob))
    res.status(200).send(data)
}

export default getLists
