import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
    filename: (request, file, callback) => {
      crypto.randomBytes(16, (err, response) => {
        if (err) return callback(err);

        return callback(
          null,
          response.toString('hex') + extname(file.originalname)
        );
      });
    },
  }),
};
