const express = require('express');
const ProductManager = require('../manager/product-manager.js');

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(PORT, () => console.log(`Listening on port ${server.address().port}...`));
server.on("error", error => console.log(`Server error ${error}`))


const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        let { limit } = req.query;

        if (limit) {
            limit = parseInt(limit);
            if (isNaN(limit)) return res.status(400).send({ error: "Invalid limit" });
            res.send(products.slice(0, limit));
        } else {
            res.send(products);
        }
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        let productId = parseInt(pid);

        if (isNaN(productId)) {
            return res.status(400).send({ error: "Invalid product Id" });
        }

        const product = await productManager.getProductById(productId);

        if (!product) return res.status(404).send({ error: "Product not found" });

        res.send(product);
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).send({ error: "Internal server error" });
    }
});

