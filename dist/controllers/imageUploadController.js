"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
// Configure multer storage with TypeScript
const storage = multer_1.default.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
const uploadImage = (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error uploading image', err });
            return;
        }
        const imageUrl = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : '';
        res.status(200).json({ imageUrl });
    });
};
exports.uploadImage = uploadImage;
