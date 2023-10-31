import productModel from "./model/product.js";
import { NotFoundError, CustomError } from '../../errors/custom.error.js';

export default class ProductsDAO {

    paginate = (filters, options) => {
        const result = productModel.paginate(filters, options);
        if (result.totalDocs === 0)
            throw new NotFoundError(20011, 'No se encontraron productos que coincidan con los criterios de búsqueda.');
        return result;
    }

    getBy = (productDTO) => {
        return productModel.findOne(productDTO).lean();
    }

    create = (productDTO) => {
        return productModel.create(productDTO);
    }

    delete = async (productDTO) => {
        return productModel.deleteOne({ _id: productDTO._id }).lean();
    }

    update = (productDTO) => {
        return productModel.findByIdAndUpdate({ _id: productDTO._id }, { $set: productDTO }).lean();
    }
}