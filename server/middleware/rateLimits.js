const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,

    message: {
        error:
            'Demasiados intentos de login. Intenta nuevamente en 15 minutos.'
    },

    standardHeaders: true,
    legacyHeaders: false
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,

    message: {
        error:
            'Demasiados registros desde esta IP.'
    },

    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    loginLimiter,
    registerLimiter
};