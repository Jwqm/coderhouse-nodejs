import UsersRepository from "./repositories/user.repository.js";

import PersistenceFactory from "../dao/persistence.factory.js";


const { UsersDAO } = await PersistenceFactory.getPersistence();


export const usersService = new UsersRepository(new UsersDAO());