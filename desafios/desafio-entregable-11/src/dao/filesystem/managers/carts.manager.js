import { Cart, DetailCart } from '../../../model/cart.js';
import FileManager from '../file.manager.js';
import { CustomError, NotFoundError } from '../../../errors/custom.error.js';
import ProductsManager from './products.manager.js';

class CartsManager {
  productsManager;
  fileManager;

  constructor() {
    this.fileManager = new FileManager('\\dao\\filesystem\\files\\carts.json');
    this.productsManager = new ProductsManager();
    this.getLatestIdCart();
  }

  async getLatestIdCart() {
    try {
      const carts = await this.getCarts();
      if (carts.length > 0) Cart.id = carts.reduce((prev, current) => (prev.id > current.id ? prev : current)).id;
      else Cart.id = 0;
    } catch (error) {
      throw new CustomError(200101, 'Error al obtener el ultimo id');
    }
  }

  createCart = async () => {
    try {
      const cart = new Cart();
      cart.detailCart = [];
      return this.fileManager.saveDataToFile(cart);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20101, 'Error al crear el carrito de compra');
    }
  }

  addCart = async (cart) => {
    try {
      return this.fileManager.saveDataToFile(cart);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20120, 'Error al agregar el carrito de compra');
    }
  }

  getCartById = async (id) => {
    try {
      const cart = (await this.getCarts()).find(cart => cart.id === id);
      if (!cart) throw new CustomError(20111, 'Carrito de compra no encontrado');

      return cart;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20112, 'Error al obtener el carrito de compra');
    }
  }

  getIndexOfCartAndDetailCartById = async (idCart, idProduct) => {
    try {
      const carts = await this.getCarts();
      const indexOfCart = carts.findIndex(cart => cart.id === idCart);
      if (indexOfCart === -1) throw new NotFoundError(20111, 'Carrito de compras no encontrado');

      const indexOfDetailCart = carts[indexOfCart].detailCart.findIndex(detailCart => detailCart.idProduct === idProduct);

      return {
        indexCart: indexOfCart,
        indexDetailCart: indexOfDetailCart,
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20113, 'Error al obtener el carrito de compra y sus productos');
    }
  }

  getCarts = async () => {
    try {
      return this.fileManager.getDataFromFile();
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20110, 'Error al obtener el carrito de compra');
    }
  }

  updateCartAndProduct = async (idCard, idProduct, units, addProduct) => {
    try {
      const product = await this.productsManager.getProductById(idProduct);
      const { indexCart, indexDetailCart } = await this.getIndexOfCartAndDetailCartById(idCard, product.id);
      const carts = await this.getCarts();

      if (addProduct) {
        if (product.stock < units) {
          throw new CustomError(10015, `Error solo quedan en stock ${product.stock} productos`);
        }
        product.stock -= units;
      } else {
        product.stock += units;
      }

      if (indexDetailCart === -1) {
        carts[indexCart].detailCart.push(new DetailCart(product.id, units));
      }
      else {
        const detailCart = carts[indexCart].detailCart[indexDetailCart];
        if (addProduct) {
          detailCart.quantity += units;
        } else {
          if (detailCart.quantity < units) {
            throw new CustomError(10016, `Error solo puede quitar ${detailCart.quantity} productos del carrito de compras`);
          }
          detailCart.quantity -= units;
        }
      }

      await this.productsManager.updateProduct({ id: product.id, stock: product.stock });

      return this.fileManager.saveAllDataToFile(carts);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20130, 'Error al actualizar el carrito de compra');
    }
  }

  deleteCart = async (id) => {
    try {
      const carts = await this.getCarts();
      const indexOfCart = carts.findIndex(cart => cart.id === id);

      if (indexOfCart === -1) throw new NotFoundError(20111, 'Carrito de compras no encontrado');

      carts.splice(indexOfCart, 1);

      return this.fileManager.saveAllDataToFile(carts);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(20140, 'Error al eliminar el carrito de compra');
    }
  }

}

export default CartsManager;