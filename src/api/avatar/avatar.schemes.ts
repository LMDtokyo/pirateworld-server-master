import Joi from 'joi';

// Для GET запросов — если  нужно будет получать аватар по ID пользователя
const avatarIdSchema = Joi.object({
    id: Joi.string().regex(/^\d+$/).required()
});

const avatarUploadSchema = Joi.object({
    // Валидацию полей тела запроса можно тут добавлять, если нужны доп параметры.
    // Файлы через multer идут отдельно, поэтому тут обычно пусто
});

export { avatarIdSchema, avatarUploadSchema };
