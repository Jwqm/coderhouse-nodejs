import UserManager from './managers/userManager.js';

const manager = new UserManager('./files/users.json');

const env = async () => {
    // const user = {
    //     nombre: 'Alex',
    //     apellido: 'Pinaida',
    //     nombreUsuario: 'alex',
    //     contrasena: '1234'
    // };

    // await manager.createUser(user);
    await manager.validateUser('alex', '66666');
}

env();