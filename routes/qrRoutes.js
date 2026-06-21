const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

// Home page
router.get('/', (req, res) => {
    res.render('index');
});

// Generate QR API
router.post('/api/generate', qrController.generateQR);

module.exports = router;
