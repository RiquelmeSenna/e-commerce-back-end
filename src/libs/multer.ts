import multer from "multer";

const allowedFiles = ['image.jpg', 'image/jpeg', 'image.png']

export const upload = multer({
    dest: './tmp',
    fileFilter: (req, file, callback) => callback(
        null,
        allowedFiles.includes(file.mimetype)
    )
})