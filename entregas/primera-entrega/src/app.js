const express = require('express');
const productsRoutes = require('./routes/products.routes.js');
const cartsRoutes = require('./routes/carts.routes.js');
const errorHandler = require('./middlewares/response.error.handler.js');

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', productsRoutes);
app.use('/api', cartsRoutes);
app.use(errorHandler);
const server = app.listen(PORT, () => console.log(`Listening on port ${server.address().port}...`));
server.on("error", error => console.log(`Server error ${error}`));