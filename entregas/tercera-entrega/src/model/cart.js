export class Cart {
    static id = 0;

    constructor(id, detailCart) {
        this.id = id || ++Cart.id;
        this.detailCart = detailCart;
    }
}

export class DetailCart {
    constructor(idProduct, quantity) {
        this.idProduct = idProduct;
        this.quantity = quantity;
    }
}
