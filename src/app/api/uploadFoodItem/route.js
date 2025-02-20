import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = './public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Error uploading file: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
  const { title, description, price, categoryId, subcategoryId } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const newFoodItem = {
    id: Date.now().toString(),
    title,
    description,
    price,
    fileUrl,
  };


  res.status(200).json({ newFoodItem });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
