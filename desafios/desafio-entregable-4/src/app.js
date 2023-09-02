import express from 'express';
import { Server } from "socket.io";
import handlebars from 'express-handlebars';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import errorHandler from './middlewares/response.error.handler.js';
import { __dirname } from "./utils.js";
import http from 'http';
import ProductsManager from './manager/products.manager.js';

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use('/api', productsRoutes);
app.use('/api', cartsRoutes);
app.use("/", viewsRouter);
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server);
const productManager = new ProductsManager();
io.on('connection', async (socket) => {
    console.log("Cliente conectado id: ", socket.id);

    socket.on("addProduct", async (obj) => {
        await productManager.addProduct(obj);
    });

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
    });
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });

    const listProducts = await productManager.getProducts({});
    io.emit("sendProducts", listProducts);
});
server.listen(PORT, () => console.log(`Listening on port ${server.address().port}...`));
server.on("error", error => console.log(`Server error ${error}`));
