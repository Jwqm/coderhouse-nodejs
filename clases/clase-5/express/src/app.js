const express = require('express');

const app = express();

app.get('/saludo', (req, resp) => {
    resp.send({ mensaje: "Test backend Express" });
})

app.get('/usuario', (req, resp) => {
    const user = {
        nombre: "Jose",
        apellido: "Quezada",
        edad: 33,
        correo: "aaa@aaa"
    }
    return resp.send(user);
})

const server = app.listen(8080, () => console.log("Listening on port 8080..."));

server.on("error", error => console.log(`Error en el servidor ${error}`))

