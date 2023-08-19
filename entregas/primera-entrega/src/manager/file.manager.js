const Fs = require('fs');
const Path = require('path');
const { CustomError } = require('../errors/custom.error.js');

class FileManager {
    path;

    constructor(route) {
        this.path = Path.dirname(__dirname) + route;
        this.createFile();
    }

    async createFile() {
        if (!Fs.existsSync(this.path)) Fs.writeFileSync(this.path, JSON.stringify([]), 'utf8');
    }

    getDataFromFile() {
        return JSON.parse(Fs.readFileSync(this.path, 'utf-8'));
    }

    saveDataToFile(data) {
        try {
            const allData = this.getDataFromFile();
            allData.push(data);
            return this.saveAllDataToFile(allData);
        } catch (error) {
            console.log("00011 -> ", error);
            throw new CustomError(11, 'Error al guardar datos en el archivo');
        }
    }

    saveAllDataToFile(data) {
        try {
            Fs.writeFileSync(this.path, JSON.stringify(data, null, '\t'), 'utf8');
            return true;
        } catch (error) {
            throw new CustomError(10, 'Error al actualizar datos en el archivo');
        }
    }
}

module.exports = FileManager;