import ProductsDTO from "../../dao/dto/products.dto.js";
import { CustomError, NotFoundError } from "../../errors/custom.error.js";
export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return (await this.dao.get()).map(product => ProductsDTO.fromDatabaseData(product));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20010, 'Error al obtener los productos');
        }
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

    paginate = async (query) => {
        try {
            const options = {
                lean: true,
                page: query.page || 1,
                limit: query.limit || 10
            };

            if (query.sort) {
                options.sort = { ['price']: query.sort };
            }

            const filters = {};

            if (query.title) {
                filters.title = query.title;
            }

            if (query.description) {
                filters.description = query.description;
            }

            if (query.code) {
                filters.code = query.code;
            }

            if (query.price) {
                filters.price = query.price;
            }

            if (query.category) {
                filters.category = query.category;
            }

            const result = await this.dao.paginate(filters, options);

            const hasPrevPage = result.hasPrevPage;
            const hasNextPage = result.hasNextPage;

            const prevLink = hasPrevPage ? `/productos?page=${result.prevPage}` : null;
            const nextLink = hasNextPage ? `/productos?page=${result.nextPage}` : null;

            return {
                payload: result.docs.map(product => ProductsDTO.fromDatabaseData(product)),
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20010, 'Error al obtener los productos');
        }
    }

    create = async (productDTO) => {
        try {
            const existProduct = await this.dao.getBy(ProductsDTO.build({ code: productDTO.code }));
            if (existProduct) throw new CustomError(20021, `Error ya existe un producto con el codigo ${existProduct.code}`);

            return ProductsDTO.fromDatabaseData(await this.dao.create(productDTO.toDatabaseData()));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20020, 'Error al agregar el producto');
        }
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

    delete = async (productDTO) => {
        try {
            const product = ProductsDTO.fromDatabaseData(await this.dao.delete(productDTO.toDatabaseData()));
            if (!product) throw new NotFoundError(20011, 'Producto no encontrado');

            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20040, 'Error al eliminar el producto');
        }
    }

}