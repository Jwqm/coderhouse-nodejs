import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import errorHandler from './middlewares/response.error.handler.js';
import { __dirname } from "./utils.js";
import config from "./config/config.js"
import http from 'http';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';

import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';
import viewsRoutes from './routes/views.routes.js';
import initializeStrategies from './config/passport.config.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo.URL,
        ttl: 600
    }),
    secret: 'coderhouse', // Una cadena secreta para firmar la sesión
    resave: false, // Evita que se guarde la sesión en cada solicitud
    saveUninitialized: true, // Guarda una sesión incluso si no está inicializada
    cookie: { secure: false }, // Configuración de la cookie de sesión
}));

initializeStrategies();
app.use(passport.initialize());

const connection = mongoose.connect(config.mongo.URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use("/", viewsRoutes);
app.use(errorHandler);

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Listening on port ${server.address().port}...`));
server.on("error", error => console.log(`Server error ${error}`));
