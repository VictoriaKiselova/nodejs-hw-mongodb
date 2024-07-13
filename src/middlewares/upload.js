import multer from 'multer';
import createHttpError from 'http-errors';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, callback) => {
    const uniquePreffix = Date.now();
    const filename = `${uniquePreffix}_${file.originalname}`;
    callback(null, filename);
  },
});

const fileFilter = (req, file, callback) => {
  if (!file) {
    return callback(createHttpError(400, 'No file provided'));
  }
  const extension = req.file.originalname.split('.').pop();
  if (extension === 'exe') {
    return callback(createHttpError(400, '.exe file not allow'));
  }
  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});
export default upload;
