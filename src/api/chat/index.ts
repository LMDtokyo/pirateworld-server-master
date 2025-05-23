import { Router, Request, Response } from 'express'
import prisma from '../../database/index.js' // <--- обязательно .js, иначе TS2834

const router = Router()

router.get('/:chatId', async (req: Request<{ chatId: string }>, res: Response) => {
    const { chatId } = req.params

    const messages = await prisma.chatMessage.findMany({
        where: { chatId },
        include: { sender: true },
        orderBy: { timestamp: 'desc' },
        take: 40
    })

    res.json(messages)
})

export default router
