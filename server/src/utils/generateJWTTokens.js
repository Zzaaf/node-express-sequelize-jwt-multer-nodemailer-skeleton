const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const generateJWTTokens = (payload) => ({
    accessToken: jwt.sign(
        payload,
        process.env.SECRET_ACCESS_TOKEN,
        jwtConfig.access
    ),
    refreshToken: jwt.sign(
        payload,
        process.env.SECRET_REFRESH_TOKEN,
        jwtConfig.refresh
    ),
});

module.exports = generateJWTTokens;