import fs from 'fs';
import { CustomError } from '../../errors/custom.error.js';
import { __dirname } from "../../utils.js";

class FileManager {
    path;

    constructor(route) {
        this.path = __dirname + route;
        this.createFile();
    }

    async createFile() {
        if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, JSON.stringify([]), 'utf8');
    }

    getDataFromFile() {
        return JSON.parse(fs.readFileSync(this.path, 'utf-8'));
    }

    saveDataToFile(data) {
        try {
            const allData = this.getDataFromFile();
            allData.push(data);
            return this.saveAllDataToFile(allData);
        } catch (error) {
            throw new CustomError(11, 'Error al guardar datos en el archivo');
        }
    }

    saveAllDataToFile(data) {
        try {
            fs.writeFileSync(this.path, JSON.stringify(data, null, '\t'), 'utf8');
            return true;
        } catch (error) {
            throw new CustomError(10, 'Error al actualizar datos en el archivo');
        }
    }
}

export default FileManager;