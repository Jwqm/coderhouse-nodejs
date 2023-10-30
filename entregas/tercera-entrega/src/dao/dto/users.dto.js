export default class UserDTO {
    constructor({ name, firstName, lastName, email, age, password, role, cart }) {
        if (name) this.name = name;
        if (firstName) this.firstName = firstName;
        if (lastName) this.lastName = lastName;
        if (email) this.email = email;
        if (age) this.age = age;
        if (password) this.password = password;
        if (role) this.role = role;
        if (cart) this.cart = cart;
    }
}