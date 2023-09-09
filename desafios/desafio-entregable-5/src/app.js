import express from 'express';
import handlebars from 'express-handlebars';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import errorHandler from './middlewares/response.error.handler.js';
import { __dirname } from "./utils.js";
import http from 'http';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 8080;

const connection = mongoose.connect("mongodb+srv://coderhouse:coderhouse@cluster0.mkyjrhu.mongodb.net/ecommerce?retryWrites=true&w=majority");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use('/api', productsRoutes);
app.use('/api', cartsRoutes);
app.use("/", messagesRoutes);
app.use(errorHandler);

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Listening on port ${server.address().port}...`));
server.on("error", error => console.log(`Server error ${error}`));
