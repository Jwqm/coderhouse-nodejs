import CartsDTO from "../../dao/dto/carts.dto.js";
import ProductsDTO from "../../dao/dto/products.dto.js";
import { CustomError, NotFoundError } from "../../errors/custom.error.js";
import { productsService } from "../../services/repositories.service.js";
import { errorCodes, errorMessages } from "../../dictionaries/errors.js"

export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return (await this.dao.get()).map(cart => CartsDTO.fromDatabaseData(cart));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_CART, errorMessages[errorCodes.ERROR_GET_CART]);
        }
    }

    getBy = async (cartDTO) => {
        try {
            const cart = CartsDTO.fromDatabaseData(await this.dao.getBy(cartDTO.toDatabaseData()));
            if (!cart) throw new NotFoundError(errorCodes.ERROR_GET_CART_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_CART_NOT_FOUND]);

            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_CART_WITH, errorMessages[errorCodes.ERROR_GET_CART_WITH]);
        }
    }

    create = async (cartDTO) => {
        try {
            if (cartDTO) return CartsDTO.fromDatabaseData(await this.dao.create(cartDTO.toDatabaseData()));
            return new CartsDTO(await this.dao.create({}));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_CART, errorMessages[errorCodes.ERROR_CREATE_CART]);
        }
    }

    updateBy = async (cartDTO, productDTO) => {
        try {
            return CartsDTO.fromDatabaseData(await this.dao.updateBy(cartDTO.toDatabaseData(), productDTO.toDatabaseData()));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT, errorMessages[errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT]);
        }
    }

    delete = async (cartDTO) => {
        try {
            const cart = CartsDTO.fromDatabaseData(await this.dao.delete(cartDTO.toDatabaseData()));
            if (!cart) throw new NotFoundError(errorCodes.ERROR_GET_CART_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_CART_NOT_FOUND]);

            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_DELETE_CART, errorMessages[errorCodes.ERROR_DELETE_CART]);
        }
    }

    createBy = async (cartDTO, productDTO) => {
        try {
            return CartsDTO.fromDatabaseData(await this.dao.createBy(cartDTO.toDatabaseData(), productDTO.toDatabaseData()));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_CART_WITH_PRODUCT, errorMessages[errorCodes.ERROR_CREATE_CART_WITH_PRODUCT]);
        }
    }

    update = async (cartDTO) => {
        try {
            return CartsDTO.fromDatabaseData(await this.dao.update(cartDTO.toDatabaseData()));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_CART, errorMessages[errorCodes.ERROR_UPDATE_CART]);
        }
    }

    updateWithProduct = async (cartDTO, productsDTO, add) => {
        const successProducts = [];
        const failedProducts = [];

        for (const productUpdateDTO of productsDTO) {
            try {
                const productDTOSearch = await productsService.getBy(ProductsDTO.build({ id: productUpdateDTO.id }));
                if (!productDTOSearch) {
                    failedProducts.push(productsDTO);
                    continue;
                }

                const cartDTOSearch = await this.getBy(cartDTO);
                const quantity = parseInt(productUpdateDTO.quantity);

                if (add) {
                    if (productDTOSearch.stock < quantity) {
                        //throw new CustomError(10015, `Error solo quedan en stock ${product.stock} productos`);
                        failedProducts.push(productUpdateDTO);
                        continue;
                    }
                    productDTOSearch.stock -= quantity;
                } else {
                    productDTOSearch.stock += quantity;
                }
                productDTOSearch.quantity = quantity;

                let productCartDTO = cartDTOSearch.products.find((item) => item.product._id.toString() == productDTOSearch.id.toString());
                if (!productCartDTO) {
                    productCartDTO = { id: productDTOSearch.id.toString(), quantity: 0 };
                    cartDTOSearch.products.push(productCartDTO);
                }

                if (add) {
                    productCartDTO.quantity += quantity;
                } else {
                    if (productCartDTO.quantity < quantity) {
                        //throw new CustomError(10016, `Error solo puede quitar ${productCart.quantity} productos del carrito de compras`);
                        failedProducts.push(productUpdateDTO);
                        continue;
                    }
                    productCartDTO.quantity -= productUpdateDTO.quantity;
                }

                await this.update(cartDTOSearch);
                await productsService.update(ProductsDTO.build({ id: productDTOSearch.id, stock: productDTOSearch.stock }));

                successProducts.push(productUpdateDTO);
            } catch (error) {
                failedProducts.push(productUpdateDTO);
            }
        }

        const update = failedProducts.length > 0 ? false : true;

        return { update, products: update === false ? failedProducts : successProducts };
    };
}