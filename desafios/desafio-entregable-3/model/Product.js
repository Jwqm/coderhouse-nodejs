class Product {
    static id = 0;

    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id ? id : ++Product.id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

module.exports = Product;
