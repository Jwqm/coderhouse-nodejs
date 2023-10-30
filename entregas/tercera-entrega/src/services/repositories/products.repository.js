import ProductsDTO from "../../dao/dto/products.dto.js";
import { CustomError } from "../../errors/custom.error.js";
export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = () => {
        return this.dao.get();
    }

    getBy = async (productDTO) => {
        try {
            const product = ProductsDTO.fromDatabaseData(await this.dao.getBy(productDTO.toDatabaseData()));
            if (!product) throw new NotFoundError(20011, 'Producto no encontrado');

            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20012, 'Error al obtener el producto');
        }
    }

    add = (product) => {
        return this.dao.add(product.toDatabaseData());
    }

    create = (product) => {
        return this.dao.create(product.toDatabaseData());
    }

    update = async (productDTO) => {
        try {
            const product = ProductsDTO.fromDatabaseData(await this.dao.update(productDTO.toDatabaseData()));
            if (!product) throw new NotFoundError(20011, 'Producto no encontrado');

            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20030, 'Error al actualizar el producto');
        }
    }

}