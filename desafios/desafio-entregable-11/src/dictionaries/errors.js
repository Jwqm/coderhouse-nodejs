export const errorCodes = {
    //Carts
    ERROR_CREATE_CART: "20100",
    ERROR_CREATE_CART_WITH_PRODUCT: "20102",
    ERROR_GET_CART: "20110",
    ERROR_GET_CART_NOT_FOUND: "20111",
    ERROR_GET_CART_WITH: "20112",
    ERROR_UPDATE_CART: "20120",
    ERROR_UPDATE_CART_WITH_PRODUCT: "20122",
    ERROR_DELETE_CART: "20130",
    //Products
    ERROR_GET_PRODUCT: "20010",
    ERROR_GET_PRODUCT_NOT_FOUND: "20011",
    ERROR_GET_PRODUCT_WITH: "20012",
    ERROR_CREATE_PRODUCT: "20020",
    ERROR_CREATE_PRODUCT_CODE_DUPLICATE: "20021",
    ERROR_UPDATE_PRODUCT: "20030",
    ERROR_DELETE_PRODUCT: "20040",
    //Tickets
    ERROR_CREATE_TICKET: "20200",
};

export const errorMessages = {
    //Carts
    [errorCodes.ERROR_CREATE_CART]: 'Error al crear el carrito de compra',
    [errorCodes.ERROR_CREATE_CART_WITH_PRODUCT]: 'Error al crear el carrito de compra con el producto',
    [errorCodes.ERROR_GET_CART]: 'Error al obtener el carrito de compra',
    [errorCodes.ERROR_GET_CART_NOT_FOUND]: 'Carrito de compra no encontrado',
    [errorCodes.ERROR_GET_CART_WITH]: 'Carrito de compra no encontrado para el filtro aplicado',
    [errorCodes.ERROR_UPDATE_CART]: 'Error al actualizar el carrito de compra',
    [errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT]: 'Error al crear el carrito de compra con el producto',
    [errorCodes.ERROR_DELETE_CART]: 'Error al eliminar el carrito de compra',
    //Products
    [errorCodes.ERROR_GET_PRODUCT]: 'Error al obtener los productos',
    [errorCodes.ERROR_GET_PRODUCT_NOT_FOUND]: 'Producto no encontrado',
    [errorCodes.ERROR_GET_PRODUCT_WITH]: 'Error al obtener el producto',
    [errorCodes.ERROR_CREATE_PRODUCT]: 'Error al crear el producto',
    [errorCodes.ERROR_CREATE_PRODUCT_CODE_DUPLICATE]: 'Error ya existe un producto con el código ingresado',
    [errorCodes.ERROR_UPDATE_PRODUCT]: 'Error al actualizar el producto',
    [errorCodes.ERROR_DELETE_PRODUCT]: 'Error al eliminar el producto',
    //Tickets
    [errorCodes.ERROR_CREATE_TICKET]: 'Error al crear el ticket',
};