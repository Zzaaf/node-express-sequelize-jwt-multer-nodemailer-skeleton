const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const jwt = require('jsonwebtoken');
const formatResponse = require('../utils/formatResponse');

function verifyAccessToken(req, res, next) {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        const { user } = jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
        res.locals.user = user;
        next();
    } catch ({ message }) {
        // Если токен доступа "протух", формируем статус код 403
        res
            .status(403)
            .json(formatResponse(403, 'Invalid access token', null, message));
    }
}

module.exports = verifyAccessToken;