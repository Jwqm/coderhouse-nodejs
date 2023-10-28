import config from "../config/config.js";

export default class PersistenceFactory {

    static getPersistence = async () => {
        //Tengo una lista de las ENTIDADES que necesito modelar a nivel persistencia.
        let ProductsDAO;
        let CartsDAO;
        let UsersDAO;

        switch (config.app.PERSISTENCE) {
            case "MEMORY": {
                //ProductsDao = (await import('./mongo/products.dao.js')).default;
                //CartsDao = (await import('./Memory/carts.dao.js')).default;
                break;
            }
            case "FS": {
                //ProductsDao = (await import('./filesystem/products.dao.js')).default;
                //CartsDao = (await import('./filesystem/carts.dao.js')).default;
                break;
            }
            case "MONGO": {
                ProductsDAO = (await import('./mongo/products.dao.js')).default;
                CartsDAO = (await import('./mongo/carts.dao.js')).default;
                UsersDAO = (await import('./mongo/users.dao.js')).default;
                break;
            }
        }
        return {
            ProductsDAO,
            CartsDAO,
            UsersDAO,
        }
    }

}