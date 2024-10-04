const path = require('path');
const multer = require('multer');

// Configure multer storage for profile pictures
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images'); // Path to save images
    },
    filename: (req, file, cb) => {
        const cid = req.body.cid;
        cb(null, `${cid}${path.extname(file.originalname)}`); // Renaming the file with CID
    }
});

// Configure multer storage for design files
const designStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Path to save design files
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname); // Unique filename
        cb(null, uniqueName); // Saving file with a unique name
    }
});

const upload = multer({ storage: imageStorage });
const uploadDesignFile = multer({ storage: designStorage });

const uploadProfilePicture = (req, res) => {
    res.status(200).json({ message: 'Profile picture uploaded successfully' });
};

// New handler for design file upload
const uploadDesignFileHandler = (req, res) => {
    const filePath = req.file.path.replace(/\\/g, '/'); // Normalize path for web
    res.status(200).json({ message: 'Design file uploaded successfully', filePath });
};

// Function to handle file download
const downloadFile = (req, res) => {
    const fileName = req.params.fileName; // Get the file name from the request
    const filePath = path.join(__dirname, '../uploads', fileName); // Correct path to the file

    res.download(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
};

module.exports = {
    upload,
    uploadProfilePicture,
    uploadDesignFile: uploadDesignFile.single('designFile'), // Export the design file upload handler
    uploadDesignFileHandler,
    downloadFile // Export the download function
};
