const express = require('express');
const router = express.Router();
const { 
    upload, 
    uploadProfilePicture, 
    uploadDesignFile, 
    uploadDesignFileHandler, 
    downloadFile 
} = require('../controllers/uploadController');

// POST endpoint for uploading profile picture
router.post('/uploadprofilepicture', upload.single('file'), uploadProfilePicture);

// POST endpoint for uploading design file
router.post('/upload/design', uploadDesignFile, uploadDesignFileHandler);

// GET endpoint for downloading design file
router.get('/download/:fileName', downloadFile);

module.exports = router;
