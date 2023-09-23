export class Product {
    static id = 0;

    constructor(id, title, description, code, price, status, stock, category, thumbnails) {
        this.id = id || ++Product.id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;
    }
}