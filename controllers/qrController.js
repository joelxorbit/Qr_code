const { generateQRBuffer } = require('../utils/qrGenerator');

const generateQR = async (req, res) => {
    try {
        const { text, options } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text/URL is required to generate a QR code' });
        }

        const format = options?.format || 'png';
        
        // Generate QR Code
        const data = await generateQRBuffer(text, options || {});

        if (format === 'svg') {
            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(data);
        } else {
            // PNG
            res.setHeader('Content-Type', 'image/png');
            res.send(data);
        }
    } catch (error) {
        console.error('QR Generation Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    generateQR
};
