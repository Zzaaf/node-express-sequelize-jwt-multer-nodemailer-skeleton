/**
 * Собирает единый формат ответа от сервера.
 * @param {number} statusCode - статус ответа HTTP.
 * @param {string} message - текстовое сообщение, описывающее статус ответа.
 * @param {object|null} [data=null] - данные, которые сервер возвращает клиенту.
 * @param {object|null} [error=null] - объект с ошибкой, если она возникла
 * @returns {object} - объект ответа, формата:
 * {
 *   statusCode: number,  // HTTP статус код
 *   message: string,     // Сообщение
 *   data: object|null,   // Данные или null
 *   errors: object|null  // Ошибка или null
 * }
 */
function formatResponse(statusCode, message, data = null, error = null) {
    return {
        statusCode,
        message,
        data,
        error,
    };
}

module.exports = formatResponse;