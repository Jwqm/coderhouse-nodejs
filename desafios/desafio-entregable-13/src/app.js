import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import errorHandler from './middlewares/response.error.handler.js';
import __dirname from "./utils.js";
import config from "./config/config.js"
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { addLogger } from './middlewares/logger.handler.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';

import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';
import viewsRoutes from './routes/views.routes.js';
import logsRoutes from './routes/logs.routes.js';
import initializeStrategies from './config/passport.config.js';

import jwt from 'jsonwebtoken';
const secretKey = 'jwtSecret'; // Cambia esto por una clave secreta segura

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Listening on port ${server.address().port}...`));

const connection = mongoose.connect(config.mongo.URL);
const swaggerSpecOptions = {
    definition: {
        openapi:'3.0.1',
        info: {
            title:'Todo Hogar docs',
            description: 'Aplicación para compra de electrodomesticos.'
        }
        },
        apis: [`${__dirname}/docs/**/*.yml`]
}
const swaggerSpec = swaggerJSDoc(swaggerSpecOptions);
app.use('/apidocs',swaggerUIExpress.serve,swaggerUIExpress.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(addLogger);
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo.URL,
        ttl: 600
    }),
    secret: "coderhouse", // Una cadena secreta para firmar la sesión
    resave: false, // Evita que se guarde la sesión en cada solicitud
    saveUninitialized: true, // Guarda una sesión incluso si no está inicializada
    cookie: { httpOnly: false, secure: false }, // Configuración de la cookie de sesión
}));

initializeStrategies();

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/', logsRoutes);
app.use("/", viewsRoutes);
app.use(errorHandler);

app.post('/test/login', (req, res) => {
    // Verifica las credenciales del usuario
    const { username, password } = req.body;

    // Lógica de autenticación aquí...

    // Si la autenticación es exitosa, genera un token JWT y envíalo al cliente
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1m' });
    res.cookie('authCookie', token);
    res.cookie('authToken', token);
    
    res.clearCookie('authCookie');
    res.clearCookie('authToken');
    res.json({ message: 'Inicio de sesión exitoso' });
});

app.get('/test/secure-route', (req, res) => {
    // Verifica la presencia y validez del token en la cookie
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó el token de autenticación' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token no válido' });
        }

        // El token es válido, realiza acciones seguras aquí...
        res.json({ message: 'Ruta segura alcanzada', user: decoded.username });
    });
});

server.on("error", error => console.log(`Server error ${error}`));
