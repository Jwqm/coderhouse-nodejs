export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = () => {
        return this.dao.get();
    }

    getBy = (params) => {
        return this.dao.getBy(params);
    }

    add = (product) => {
        return this.dao.add(product);
    }

    create = (product) => {
        return this.dao.create(product);
    }


    /*addProduct = async (body) => {
    }

    getProductById = async (id) => {
    }

    getProductByCode = async (code) => {
    }

    getProducts = async () => {
    }

    getProductsPaginate = async (query) => {
    }

    updateProduct = async (updateProduct) => {
    }

    deleteProduct = async (id) => {
    }*/
}