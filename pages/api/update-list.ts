import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { listResToBlob } from '../../lib/list-util'
import { ListBlob, isListRes } from '../../lib/types'

const prisma = new PrismaClient()

const updateList = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST' || !isListRes(req.body?.list)) {
        res.status(405).send({ message: 'must send list in POST request' })
        return
    }
    const blob: ListBlob = listResToBlob(req.body.list)
    try {
        await prisma.list.update({
            where: {
                key: blob.key
            },
            data: blob
        })
        res.status(200).send({ message: 'list updated' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'list update failed' })
    }
}

export default updateList