const Product = require('../model/Product.js');
const fs = require('fs');

class ProductManager {
  path;

  constructor() {
    this.path = './products.json';
    this.createFile();
    this.getLatestIdProduct();
  }

  createFile() {
    if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, JSON.stringify([]), 'utf8');
  }

  getLatestIdProduct() {
    try {
      const products = this.getProducts();
      if (products.length !== 0) Product.id = products.reduce((prev, current) => (prev.id > current.id ? prev : current)).id;
      else Product.id = 0;
    } catch (error) {
      console.log("20001 -> ", error);
    }
  }

  addProduct(product) {
    try {
      this.saveProductToFile(product);
    } catch (error) {
      console.log("20020 -> ", error);
    }
  }

  getProductById(id) {
    try {
      return this.getProducts().find(product => product.id === id);
    } catch (error) {
      console.log("20011 -> ", error);
    }
  }

  getProductByCode(code) {
    try {
      return this.getProducts().find(product => product.code === code);
    } catch (error) {
      console.log("20012 -> ", error);
    }
  }

  getProducts() {
    try {
      return this.getProductsFromFile();
    } catch (error) {
      console.log("20010 -> ", error);
    }
  }

  updateProduct(updateProduct) {
    try {
      const products = this.getProducts().map(product => {
        if (product.id === updateProduct.id) {
          product.title = updateProduct.title;
          product.description = updateProduct.description;
          product.price = updateProduct.price;
          product.thumbnail = updateProduct.thumbnail;
          product.code = updateProduct.code;
          product.stock = updateProduct.stock;
          return product;
        } else {
          return product;
        }
      });
      this.saveProductsToFile(products);
    } catch (error) {
      console.log("20030 -> ", error);
    }
  }

  deleteProduct(id) {
    try {
      const products = this.getProductsFromFile().filter(product => product.id !== id);
      this.saveProductsToFile(products);
    } catch (error) {
      console.log("20040 -> ", error);
    }
  }

  getProductsFromFile() {
    return JSON.parse(fs.readFileSync(this.path, 'utf-8'));
  }

  saveProductToFile(product) {
    const products = this.getProductsFromFile();
    products.push(product);
    this.saveProductsToFile(products);
  }

  saveProductsToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'), 'utf8');
  }
}

module.exports = ProductManager;