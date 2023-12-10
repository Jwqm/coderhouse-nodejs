import __dirname from '../utils.js';

export default {
    welcome: {
        subject: '¡Bienvenido!',
        attachments: [
            {
                filename: 'banner.png',
                path: `${__dirname}/public/img/todohogar.png`,
                cid: 'banner'
            }
        ]
    },
    passwordrestore: {
        subject: 'Restablecimiento de contraseña',
        attachments: [
            {
                filename: 'banner.png',
                path: `${__dirname}/public/img/todohogar.png`,
                cid: 'banner'
            }
        ]
    }
}