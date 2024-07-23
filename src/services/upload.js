const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = './public/uploads/banners';
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `banner-${uniqueSuffix}${ext}`);
  },
});
const picStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/pic");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `pic-${uniqueSuffix}${ext}`);
  },
});
module.exports ={picStorage,bannerStorage}