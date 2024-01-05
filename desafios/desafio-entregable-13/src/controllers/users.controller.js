import { sendResponse } from '../middlewares/response.handler.js';
import { usersService } from "../services/repositories.service.js";
import UsersDTO from '../dao/dto/users.dto.js';
import { NotFoundError } from '../errors/custom.error.js';

const get = async (req, res, next) => {
    try {
        const result = await usersService.get();

        return sendResponse(200, { result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const getBy = async (req, res, next) => {
    try {
        const result = await usersService.getBy(UsersDTO.build(req.params));

        return sendResponse(200, { result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await usersService.create(UsersDTO.build(req.body));

        return sendResponse(201, { message: 'Usuario creado exitosamente', result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await usersService.getBy(UsersDTO.build({ id: req.params.uid }));
        if (req.body.role === 'premium') {
            const requiredDocuments = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            if(!result.documents) throw new NotFoundError('100300', 'No posee documentos cargados');
            const hasRequiredDocuments = requiredDocuments.every(doc => result.documents.some(userDoc => userDoc.name.toLowerCase().includes(doc.toLowerCase())));
            if (!hasRequiredDocuments) throw new NotFoundError('100301', 'No se cargaron todos los documentos');
        }
        await usersService.update(req.params.uid, UsersDTO.build(req.body));

        return sendResponse(200, { message: 'Usuario actualizado exitosamente', result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const upload = async (req, res, next) => {
    try {
        const documents = req.files['documents'] ? req.files['documents'].map(file => ({ name: file.originalname, link: file.path })) : [];
        const result = await usersService.update(req.params.uid, UsersDTO.build({ documents: documents }));

        return sendResponse(200, { message: 'Documentos del usuario actualizado exitosamente', result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

export default {
    get,
    getBy,
    create,
    update,
    upload,
};
