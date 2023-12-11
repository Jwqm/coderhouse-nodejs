export default class UserDTO {
    constructor({ id, firstname, lastname, email, age, password, role, cart, documents }) {
        if (id) this.id = id;
        if (firstname) this.firstname = firstname;
        if (lastname) this.lastname = lastname;
        if (email) this.email = email;
        if (age) this.age = age;
        if (password) this.password = password;
        if (role) this.role = role;
        if (cart) this.cart = cart;
        if (documents) this.documents = documents;
    }

    static build(data) {
        return new UserDTO(data);
    }

    /*static build(data, fields) {
        return new UserDTO(data);
    }*/

    static fromDatabaseData(data) {
        if (!data) return;
        return new UserDTO({
            id: data._id ? data._id.toString() : undefined,
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            age: data.age,
            password: data.password,
            role: data.role,
            cart: data.cart,
            documents: data.documents,
        });
    }

    toDatabaseData() {
        const databaseData = {
            _id: this.id,
            firstName: this.firstname,
            lastName: this.lastname,
            email: this.email,
            age: this.age,
            password: this.password,
            role: this.role,
            cart: this.cart,
            documents: this.documents,
        };

        for (const prop in databaseData) {
            if (databaseData[prop] === undefined) {
                delete databaseData[prop];
            }
        }

        return databaseData;
    }

    static getTokenDTOFrom = (user) => {
        return {
            name: `${user.firstName} ${user.lastName}`,
            id: user._id,
            role: user.role,
            library: user.library
        }
    }
}