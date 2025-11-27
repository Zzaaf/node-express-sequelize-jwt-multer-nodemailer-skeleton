const multer = require('multer');
const path = require('path');

// Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла: timestamp + random + оригинальное расширение
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
};

// Настройка multer с лимитом в 1 МБ
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024, // 1 МБ в байтах
  },
  fileFilter: fileFilter,
});

module.exports = upload;

