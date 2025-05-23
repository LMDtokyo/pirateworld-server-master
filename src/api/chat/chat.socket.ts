import { Server, Socket } from 'socket.io'
import prisma from '../../database/index.js'
import socketEmitter from '../../ecs/helpers/SocketEmitter.js'

// Основной обработчик
export const registerChatHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('chat:message', async (data, callback) => {
            const { content, senderId, chatId, system = false } = data

            if (!content || !senderId || !chatId) {
                console.warn('[SERVER] Недостаточно данных для chat:message:', data)
                callback?.({ ok: false, error: 'Invalid payload' })
                return
            }

            try {
                const message = await prisma.chatMessage.create({
                    data: {
                        chatId,
                        content,
                        senderId,
                        system
                    },
                    include: {
                        sender: true
                    }
                })

                // Рассылаем по комнате чата
                io.emit(`chat:${chatId}`, message)

                // Отправляем подтверждение отправителю
                callback?.({ ok: true })
            } catch (err) {
                console.error('[SERVER] Ошибка при сохранении сообщения:', err)
                callback?.({ ok: false, error: 'Ошибка при сохранении сообщения' })
            }
        })
    })
}
