const { PrismaClient } = require('@prisma/client')

const getKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let key = ''
    for (let i = 0; i < 8; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return key
}

const objToStrByte = obj => {
    return Buffer.from(JSON.stringify(obj), 'utf8')
}

const testLists = [
    {
        title: 'list 0',
        date: new Date(),
        items: objToStrByte([
            {
                text: '1sdf',
                completed: true,
                children: [],
                key: getKey()
            }, {
                text: '345f',
                completed: false,
                children: [
                    {
                        text: 'fdsa',
                        completed: true,
                        children: [],
                        key: getKey()
                    }
                ],
                key: getKey()
            }, {
                text: 'mhmmmmm',
                completed: false,
                children: [
                    {
                        text: 'a',
                        completed: false,
                        children: [],
                        key: getKey()
                    }, {
                        text: 'b',
                        completed: true,
                        children: [],
                        key: getKey()
                    }, {
                        text: 'c',
                        completed: false,
                        children: [
                            {
                                text: 'd',
                                completed: false,
                                children: [],
                                key: getKey()
                            }
                        ],
                        key: getKey()
                    }
                ],
                key: getKey()
            }
        ]),
        key: getKey()
    },
    {
        title: 'list 1',
        date: new Date(),
        items: objToStrByte([
            {
                text: 'mdmd',
                completed: false,
                children: [],
                key: getKey()
            }
        ]),
        key: getKey()
    }
]

const prisma = new PrismaClient()

const seed = async () => {
    try {
        await prisma.list.deleteMany()
        console.log('list data deleted')

        await prisma.list.createMany({
            data: testLists
        })
        console.log('added test data')
    } catch (e) {
        console.log(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

seed()
