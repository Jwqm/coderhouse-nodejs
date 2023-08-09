
const prompt = require("prompt-sync")();
const ProductManager = require('../manager/product-manager.js');
const Product = require('../model/product.js');

const productManager = new ProductManager();

async function menu() {
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
        await addProduct();
        break;
      case '2':
        await listProducts();
        break;
      case '3':
        await searchProduct();
        break;
      case '4':
        await updateProduct();
        break;
      case '5':
        await deleteProduct();
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

async function chargeProduct(id) {
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

    if (!(await productManager.getProductByCode(code))) break;
    else console.log('El código ingresado ya existe en el sistema, por favor utilice otro código.');
  }

  let stock;
  while (true) {
    stock = parseInt(prompt('Ingrese stock del producto: '));
    if (isNumberPositive(stock)) break;
    else console.log('El stock ingresado es inválido. Ingrese solo valores numéricos mayores o iguales a 0.');
  }
  return new Product(id, title, description, price, thumbnail, code, stock);
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

async function addProduct() {
  console.log('\nAgregar producto.');
  const product = await chargeProduct();
  await productManager.addProduct(product);
  console.log('\nSe agrego el siguiente producto.\n', product, '\n');
}

async function updateProduct() {
  console.log('\nActualizar producto.');
  const product = (await productManager.getProductById(chargeIdProduct())) || false;
  if (product) {
    const updateProduct = await chargeProduct(product.id);
    await productManager.updateProduct(updateProduct);
    console.log('\nSe actualizo el producto correctamente.\n');
  }
  else {
    console.log('\nNo se encontro productos para el id ingresado.\n');
  }
}

async function deleteProduct() {
  console.log('\nEliminar el producto por id.');
  const product = (await productManager.getProductById(chargeIdProduct())) || false;
  if (product) {
    await productManager.deleteProduct(product.id);
    console.log('\nSe elimino el producto correctamente.\n');
  }
  else {
    console.log('\nNo se encontro productos para el id ingresado.\n');
  }
}

async function listProducts() {
  console.log('\nListado de todos los productos.');
  console.log(await productManager.getProducts(), '\n');
}

async function searchProduct() {
  console.log('\nBusqueda del producto por id.');
  console.log('Resultado de la busqueda por id.\n', (await productManager.getProductById(chargeIdProduct()) || 'Not Found'), '\n');
}


menu();