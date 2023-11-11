import { Product } from '../../../model/product.js';
import FileManager from '../file.manager.js';
import { NotFoundError, CustomError } from '../../../errors/custom.error.js';

class ProductsManager {
  fileManager;

  constructor() {
    this.fileManager = new FileManager('\\dao\\filesystem\\files\\products.json');
    this.getLatestIdProduct();
  }

  async getLatestIdProduct() {
    try {
      const products = await this.getProducts();
      if (products.length > 0) Product.id = products.reduce((prev, current) => (prev.id > current.id ? prev : current)).id;
      else Product.id = 0;
    } catch (error) {
      throw new CustomError(200001, 'Error al obtener el ultimo id');
    }
  }

  createProduct = async (body) => {
    try {
      const product = new Product();
      product.title = body.title;
      product.description = body.description;
      product.code = body.code;
      product.price = body.price;
      product.status = body.status ? true : body.status;
      product.stock = body.stock;
      product.category = body.category;
      product.thumbnails = body.thumbnails;
      return product;
    } catch (error) {
      throw new CustomError(20001, 'Error al crear el producto');
    }
  }

  addProduct = async (body) => {
    try {
      const existProduct = await this.getProductByCode(body.code);
      if (existProduct) throw new CustomError(20021, `Error ya existe un producto con el codigo ${body.code}`);

      const product = await this.createProduct(body);

      return this.fileManager.saveDataToFile(product);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20020, 'Error al agregar el producto');
    }
  }

  getProductById = async (id) => {
    try {
      const product = (await this.getProducts()).find(product => product.id === id);

      if (!product) throw new NotFoundError(20011, 'Producto no encontrado');

      return product;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20012, 'Error al obtener el producto');
    }
  }

  getProductByCode = async (code) => {
    try {
      return (await this.getProducts()).find(product => product.code === code);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20013, 'Error al obtener el producto');
    }
  }

  getProducts = async () => {
    try {
      return this.fileManager.getDataFromFile();
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20010, 'Error al obtener los productos');
    }
  }

  updateProduct = async (updateProduct) => {
    try {
      const products = await this.getProducts();
      const indexOfProduct = products.findIndex(product => product.id === updateProduct.id);

      if (indexOfProduct === -1) throw new NotFoundError(20011, 'Producto no encontrado');

      products[indexOfProduct] = {
        ...products[indexOfProduct],
        ...updateProduct,
      }

      return this.fileManager.saveAllDataToFile(products);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20030, 'Error al actualizar el producto');
    }
  }

  deleteProduct = async (id) => {
    try {
      const products = await this.getProducts();
      const indexOfProduct = products.findIndex(product => product.id === id);

      if (indexOfProduct === -1) throw new NotFoundError(20011, 'Producto no encontrado');

      products.splice(indexOfProduct, 1);

      return this.fileManager.saveAllDataToFile(products);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20040, 'Error al eliminar el producto');
    }
  }

}

export default ProductsManager;