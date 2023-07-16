class Persona {
    constructor(nombre) {
        this.nombre = nombre;
    }

    static especie = 'Humano';
    obtenerEspecie = () => {
        console.log(`Soy ${Persona.especie}`);
    }

    saludar = () => {
        console.log(`Hola soy ${this.nombre}`)
    }
}

//creo las instancias
const persona1 = new Persona('Martin');
const persona2 = new Persona('Caro');


//instancio las instancias
persona1.saludar();
persona1.obtenerEspecie();
persona2.saludar();
persona2.obtenerEspecie();

