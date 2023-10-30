import config from "../config/config.js";

export default class PersistenceFactory {

    static getPersistence = async () => {
        //Tengo una lista de las ENTIDADES que necesito modelar a nivel persistencia.
        let ProductsDAO;
        let CartsDAO;
        let UsersDAO;
        let TicketsDAO;

        switch (config.app.PERSISTENCE) {
            case "MEMORY": {
                break;
            }
            case "FS": {
                break;
            }
            case "MONGO": {
                ProductsDAO = (await import('./mongo/products.dao.js')).default;
                CartsDAO = (await import('./mongo/carts.dao.js')).default;
                UsersDAO = (await import('./mongo/users.dao.js')).default;
                TicketsDAO = (await import('./mongo/tickets.dao.js')).default;
                break;
            }
        }
        return {
            ProductsDAO,
            CartsDAO,
            UsersDAO,
            TicketsDAO,
        }
    }

}