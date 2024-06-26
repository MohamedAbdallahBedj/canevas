var path = require('path');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /doc|docx|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = { checkFileType }