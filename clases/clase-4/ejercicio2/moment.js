import moment from "moment";

const hoy = moment();
const fechaNacimiento = moment('1994-11-01', 'YYYY-MM-DD');

if (fechaNacimiento.isValid()) {
    console.log('Fecha Nacimiento:', fechaNacimiento.format('DD/MM/YYYY'));
    const diferencia = hoy.diff(fechaNacimiento, 'years');
    console.log('Edad:', diferencia);
} else {
    console.log('Fecha no válida');
}

console.log('Fecha Actual', hoy.format('DD/MM/YYYY HH:mm:ss'));


