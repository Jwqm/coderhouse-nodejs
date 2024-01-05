import ProductsDTO from "../../dao/dto/products.dto.js";
import { CustomError, NotFoundError, UnauthorizedError } from "../../errors/custom.error.js";
import { errorCodes, errorMessages } from "../../dictionaries/errors.js"

export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return (await this.dao.get()).map(product => ProductsDTO.fromDatabaseData(product));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_PRODUCT, errorMessages[errorCodes.ERROR_GET_PRODUCT]);
        }
    }

    getBy = async (productDTO) => {
        try {
            const product = ProductsDTO.fromDatabaseData(await this.dao.getBy(productDTO.toDatabaseData()));
            if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_PRODUCT_NOT_FOUND]);

            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_PRODUCT_WITH, errorMessages[errorCodes.ERROR_GET_PRODUCT_WITH]);
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
            throw new CustomError(errorCodes.ERROR_GET_PRODUCT, errorMessages[errorCodes.ERROR_GET_PRODUCT]);
        }
    }

    create = async (productDTO) => {
        try {
            const existProduct = await this.dao.getBy(ProductsDTO.build({ code: productDTO.code }));
            if (existProduct) throw new CustomError(errorCodes.ERROR_CREATE_PRODUCT_CODE_DUPLICATE, errorMessages[errorCodes.ERROR_CREATE_PRODUCT_CODE_DUPLICATE]);

            return ProductsDTO.fromDatabaseData(await this.dao.create(productDTO.toDatabaseData()));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_PRODUCT, errorMessages[errorCodes.ERROR_CREATE_PRODUCT]);
        }
    }

    update = async (productDTO) => {
        try {
            const product = ProductsDTO.fromDatabaseData(await this.dao.update(productDTO.toDatabaseData()));
            if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_PRODUCT_NOT_FOUND]);

            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_PRODUCT, errorMessages[errorCodes.ERROR_UPDATE_PRODUCT]);
        }
    }

    delete = async (productDTO, userDTO) => {
        try {
            const product = await this.getBy(productDTO);
            if (userDTO.role === 'premium' && product.owner !== userDTO.id) throw new UnauthorizedError(errorCodes.ERROR_DELETE_USER_PRODUCT, errorMessages[errorCodes.ERROR_DELETE_USER_PRODUCT]);
            await this.dao.delete(productDTO.toDatabaseData())
            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_DELETE_PRODUCT, errorMessages[errorCodes.ERROR_DELETE_PRODUCT]);
        }
    }

}