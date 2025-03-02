import multer from "multer";
import path from "path";

let storage = multer.diskStorage({
   filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
   },
   destination: (req, file, cb) => {
      cb(null, "uploads");
   },
});

let upload = multer({
   storage,
   limits: {
      fileSize: 10 * 1024 ** 2,
   },
});

export default upload;
