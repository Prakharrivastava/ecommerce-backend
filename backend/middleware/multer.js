import multer from "multer";

const storage = multer.memoryStorage();

// Single image upload (e.g., Profile Picture)
export const singleUpload = multer({ storage }).single("file");

// Multiple images upload (e.g., Product Images - max 5)
export const multipleUpload = multer({ storage }).array("images", 5);