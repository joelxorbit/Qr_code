const QRCode = require('qrcode');

/**
 * Generate a QR code buffer or string based on given text and options
 */
const generateQRBuffer = async (text, options) => {
    try {
        const qrOptions = {
            errorCorrectionLevel: options.errorCorrectionLevel || 'M',
            margin: parseInt(options.margin) || 4,
            width: parseInt(options.width) || 300,
            color: {
                dark: options.colorDark || '#000000',
                light: options.colorLight || '#ffffff'
            }
        };

        // SVG format
        if (options.format === 'svg') {
            return await QRCode.toString(text, { ...qrOptions, type: 'svg' });
        }

        // Default PNG format. qrcode library doesn't output JPEG directly natively without canvas, 
        // but its image/png is high quality.
        return await QRCode.toBuffer(text, { ...qrOptions, type: 'png' });
    } catch (error) {
        console.error("Error in qrcode:", error);
        throw new Error('Failed to generate QR Code');
    }
};

module.exports = {
    generateQRBuffer
};
