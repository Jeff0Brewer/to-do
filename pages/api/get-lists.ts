import type { NextApiRequest, NextApiResponse } from 'next'
import type { ListData, ListBlob } from '../../lib/types'
import { listBlobToData } from '../../lib/list-util'
import prisma from '../../prisma/prisma-client'

const getLists = async (req: NextApiRequest, res: NextApiResponse<Array<ListData>>) => {
    const blobs: Array<ListBlob> = await prisma.list.findMany()
    const data: Array<ListData> = blobs.map(blob => listBlobToData(blob))
    res.status(200).send(data)
}

export default getLists
