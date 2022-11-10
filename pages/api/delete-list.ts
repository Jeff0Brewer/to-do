import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const deleteList = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST' || typeof req.body?.key !== 'string') {
        res.status(405).send({ message: 'must send key in POST request' })
        return
    }
    try {
        await prisma.list.delete({ where: { key: req.body.key } })
        res.status(200).send({ message: 'list deleted' })
    } catch (e) {
        console.log(e)
        res.status(404).send({ message: 'list not found' })
    }
}

export default deleteList
