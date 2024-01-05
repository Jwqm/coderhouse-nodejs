import multer from "multer";
import __dirname from "../utils.js";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;

        if (file.fieldname === 'profiles') {
            uploadPath = '/public/uploads/profiles/';
        } else if (file.fieldname === 'products') {
            uploadPath = '/public/uploads/products/';
        } else if (file.fieldname === 'documents') {
            uploadPath = '/public/uploads/documents/';
        } else {
            uploadPath = '/public/uploads/others/';
        }

        cb(null,__dirname + uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});

const uploader = multer({storage});

export default uploader;