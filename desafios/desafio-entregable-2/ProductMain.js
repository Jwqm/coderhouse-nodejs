const prompt = require("prompt-sync")();
const ProductManager = require('./manager/ProductManager.js');
const Product = require('./model/Product.js');

const productManager = new ProductManager();

function menu() {
  let option;
  do {
    console.log('****** Menu *******');
    console.log('1 - Agregar producto');
    console.log('2 - Obtener todos los productos');
    console.log('3 - Buscar producto');
    console.log('4 - Actualizar producto');
    console.log('5 - Eliminar producto');
    console.log('6 - Salir');
    console.log('****** Fin Menu *******\n');
    option = prompt('Ingrese una opción: ');

    switch (option) {
      case '1':
        addProduct();
        break;
      case '2':
        listProducts();
        break;
      case '3':
        searchProduct();
        break;
      case '4':
        updateProduct();
        break;
      case '5':
        deleteProduct();
        break;
      case '6':
        console.log('Fin ejecucion.\n');
        break;
      default:
        console.log('Opción inválida.\n');
        break;
    }
  } while (option !== '6');
}

function chargeProduct() {
  const title = prompt('Ingrese título del producto: ');
  const description = prompt('Ingrese descripción del producto: ');

  let price;
  while (true) {
    price = parseFloat(prompt('Ingrese precio del producto: '));
    if (isNumberPositive(price)) break;
    else console.log('El precio ingresado es inválido. Ingrese solo valores numéricos mayores o iguales a 0.');
  }

  const thumbnail = prompt('Ingrese ruta de la imagen del producto: ');

  let code;
  while (true) {
    code = prompt('Ingrese código del producto: ');
    if (isEmpty(code)) {
      console.log('No se ingresaron valores para el código de producto.');
      continue;
    }

    if (!productManager.getProductByCode(code)) break;
    else console.log('El código ingresado ya existe en el sistema, por favor utilice otro código.');
  }

  let stock;
  while (true) {
    stock = parseInt(prompt('Ingrese stock del producto: '));
    if (isNumberPositive(stock)) break;
    else console.log('El stock ingresado es inválido. Ingrese solo valores numéricos mayores o iguales a 0.');
  }
  return new Product(title, description, price, thumbnail, code, stock);
}

function isNumberPositive(value) {
  return (!isNaN(value) && value >= 0);
}

function isEmpty(value) {
  return value.trim().length === 0;
}

function chargeIdProduct() {
  let id;
  while (true) {
    id = parseInt(prompt('Ingrese el id del producto: '));
    if (isNumberPositive(id)) break;
    else console.log('El id ingresado es inválido. Ingrese solo valores numéricos mayores a 0.');
  }
  return id;
}

function addProduct() {
  console.log('\nAgregar producto.');
  const product = chargeProduct();
  productManager.addProduct(product);
  console.log('\nSe agrego el siguiente producto.\n', product, '\n');
}

function updateProduct() {
  console.log('\nActualizar producto.');
  const product = (productManager.getProductById(chargeIdProduct()) || false);
  if (product) {
    const updateProduct = chargeProduct();
    updateProduct.id = product.id;
    productManager.updateProduct(updateProduct)
    console.log('\nSe actualizo el producto correctamente.\n');
  }
  else {
    console.log('\nNo se encontro productos para el id ingresado.\n');
  }
}

function deleteProduct() {
  console.log('\nEliminar el producto por id.');
  const product = (productManager.getProductById(chargeIdProduct()) || false);
  if (product) {
    productManager.deleteProduct(product.id);
    console.log('\nSe elimino el producto correctamente.\n');
  }
  else {
    console.log('\nNo se encontro productos para el id ingresado.\n');
  }
}

function listProducts() {
  console.log('\nListado de todos los productos.');
  console.log(productManager.getProducts(), '\n');
}

function searchProduct() {
  console.log('\nBusqueda del producto por id.');
  console.log('Resultado de la busqueda por id.\n', (productManager.getProductById(chargeIdProduct()) || 'Not Found'), '\n');
}


menu();