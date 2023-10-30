import CartsDTO from "../../dao/dto/carts.dto.js";
import { CustomError, NotFoundError } from "../../errors/custom.error.js";

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
}