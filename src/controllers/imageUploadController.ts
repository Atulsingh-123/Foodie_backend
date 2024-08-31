import { Request, Response } from 'express';
import multer, { StorageEngine } from 'multer';

// Configure multer storage with TypeScript
const storage: StorageEngine = multer.diskStorage({
  destination: './uploads/', 
  filename: (req: any, file: any, cb: any) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadImage = (req: Request, res: Response): void => {
  upload.single('image')(req, res, (err: any) => {
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
