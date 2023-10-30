import UsersRepository from "./repositories/user.repository.js";

import PersistenceFactory from "../dao/persistence.factory.js";
import CartsRepository from "./repositories/carts.repository.js";
import ProductsRepository from "./repositories/products.repository.js";

const { UsersDAO, CartsDAO, ProductsDAO } = await PersistenceFactory.getPersistence();

export const usersService = new UsersRepository(new UsersDAO());
export const cartsService = new CartsRepository(new CartsDAO());
export const productsService = new ProductsRepository(new ProductsDAO());