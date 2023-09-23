import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.routes.js';
import errorHandler from './middlewares/response.error.handler.js';
import { __dirname } from "./utils.js";
import http from 'http';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

const app = express();
const PORT = process.env.PORT || 8080;

const connection = mongoose.connect("mongodb+srv://coderhouse:coderhouse@cluster0.mkyjrhu.mongodb.net/ecommerce?retryWrites=true&w=majority");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://coderhouse:coderhouse@luster0.mkyjrhu.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: 600
    }),
    secret: 'coderhouse', // Una cadena secreta para firmar la sesión
    resave: false, // Evita que se guarde la sesión en cada solicitud
    saveUninitialized: true, // Guarda una sesión incluso si no está inicializada
    cookie: { secure: false }, // Configuración de la cookie de sesión
}));
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/sessions', sessionsRouter);
app.use("/", viewsRouter);
app.use(errorHandler);

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Listening on port ${server.address().port}...`));
server.on("error", error => console.log(`Server error ${error}`));
