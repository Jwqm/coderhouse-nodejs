import __dirname from '../utils.js';

export default {
    welcome: {
        subject: '¡Bienvenido a E-Commerce!',
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
    },
    removeproduct: {
        subject: 'Se ha eliminado un producto',
        attachments: [
            {
                filename: 'banner.png',
                path: `${__dirname}/public/img/todohogar.png`,
                cid: 'banner'
            }
        ]
    },
    createproduct: {
        subject: 'Se ha creado un producto',
        attachments: [
            {
                filename: 'banner.png',
                path: `${__dirname}/public/img/todohogar.png`,
                cid: 'banner'
            }
        ]
    },
    purchase: {
        subject: 'Se ha realizado la compra en E-Commerce',
        attachments: [
            {
                filename: 'banner.png',
                path: `${__dirname}/public/img/todohogar.png`,
                cid: 'banner'
            }
        ]
    }

}