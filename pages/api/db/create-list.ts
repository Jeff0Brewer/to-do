import type { NextApiRequest, NextApiResponse } from 'next'
import { listResToBlob } from '../../../lib/list-util'
import { isListRes } from '../../../lib/types'
import prisma from '../../../prisma/client'

const createList = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST' || !isListRes(req.body?.list)) {
        res.status(405).send({ message: 'must send list in POST request' })
        return
    }
    const blob = listResToBlob(req.body.list)
    try {
        await prisma.list.create({ data: blob })
        res.status(200).send({ message: 'list created' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'list creation failed' })
    }
}

export default createList
