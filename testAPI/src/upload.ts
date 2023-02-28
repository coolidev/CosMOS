import multer from 'multer';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, '.')
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage
});

export default upload;