import CartsDTO from "../../dao/dto/carts.dto.js";
import ProductsDTO from "../../dao/dto/products.dto.js";
import { CustomError, NotFoundError } from "../../errors/custom.error.js";
import { productsService } from "../../services/repositories.service.js";

export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return (await this.dao.get()).map(cart => CartsDTO.fromDatabaseData(cart));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20110, 'Error al obtener el carrito de compra');
        }
    }

    getBy = async (cartDTO) => {
        try {
            const cart = CartsDTO.fromDatabaseData(await this.dao.getBy(cartDTO.toDatabaseData()));
            if (!cart) throw new NotFoundError(20111, 'Carrito de compra no encontrado');

            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20112, 'Error al obtener el carrito de compra');
        }
    }

    create = async (cartDTO) => {
        try {
            if (cartDTO) return CartsDTO.fromDatabaseData(await this.dao.create(cartDTO.toDatabaseData()));
            return new CartsDTO(await this.dao.create({}));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20101, 'Error al crear el carrito de compra');
        }
    }

    updateBy = async (cartDTO, productDTO) => {
        try {
            return CartsDTO.fromDatabaseData(await this.dao.updateBy(cartDTO.toDatabaseData(), productDTO.toDatabaseData()));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20102, 'Error al crear el carrito de compra con el producto');
        }
    }

    delete = async (cartDTO) => {
        try {
            const cart = CartsDTO.fromDatabaseData(await this.dao.delete(cartDTO.toDatabaseData()));
            if (!cart) throw new NotFoundError(20111, 'Carrito de compra no encontrado');

            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20140, 'Error al eliminar el carrito de compra');
        }
    }

    createBy = async (cartDTO, productDTO) => {
        try {
            return CartsDTO.fromDatabaseData(await this.dao.createBy(cartDTO.toDatabaseData(), productDTO.toDatabaseData()));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20120, 'Error al actualizar el carrito de compra');
        }
    }

    update = async (cartDTO) => {
        try {
            return CartsDTO.fromDatabaseData(await this.dao.update(cartDTO.toDatabaseData()));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20120, 'Error al actualizar el carrito de compra');
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