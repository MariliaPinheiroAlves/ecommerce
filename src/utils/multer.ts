import multer from "multer";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "./images"),
  filename: (_, file, cb) => {
    const { originalname } = file;

    const auxArray = originalname.split(".");
    const extension = auxArray[1];
    const nameHex = crypto.randomBytes(20).toString("hex");

    cb(null, `${nameHex}_${Date.now()}.${extension}`);
  }
});

export const uploadImage = multer({ storage }).single("imagem");
