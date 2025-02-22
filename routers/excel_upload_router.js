import express from 'express';
import multer from 'multer';

  //const upload = multer(); //for text-only multipart form

  const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './uploads')
        },
        filename: function (req, file, cb) {
          //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, file.originalname);
        }
    });
  
    const upload = multer({ storage: storage });
    export const upload_router = express.Router();

  //upload_router.route('/data_sheet').post( upload.none(), (req, resp) => {
  upload_router.route('/data_sheet')
      .post(upload.single('file_name'), (req, resp) => {
      // console.log('req = ', req);
      console.log('form = ', req.body.name, ', file', req.file.originalname);
      const file_name = req.file.originalname;
      resp.status(200).json({ msg: `You want to upload the file ${file_name}`});
  });