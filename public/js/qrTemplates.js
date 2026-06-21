// Advanced QR Templates matching user images

const qrTemplates = [
    {
        id: 'green-speech',
        name: 'Green Speech',
        previewColor: '#10B981',
        frame: 'speech-top',
        frameColor: '#10B981',
        frameText: 'SCAN ME',
        options: {
            dotsOptions: { type: 'rounded', color: '#10B981' },
            cornersSquareOptions: { type: 'extra-rounded', color: '#10B981' },
            cornersDotOptions: { type: 'dot', color: '#10B981' },
            backgroundOptions: { color: '#ffffff' },
        }
    },
    {
        id: 'red-tag',
        name: 'Red Tag',
        previewColor: '#EF4444',
        frame: 'tag-top',
        frameColor: '#EF4444',
        frameText: 'SCAN ME',
        options: {
            dotsOptions: { type: 'classy', color: '#EF4444' },
            cornersSquareOptions: { type: 'square', color: '#EF4444' },
            cornersDotOptions: { type: 'square', color: '#EF4444' },
            backgroundOptions: { color: '#ffffff' },
        }
    },
    {
        id: 'blue-bottom',
        name: 'Blue Bottom',
        previewColor: '#3B82F6',
        frame: 'bottom-box',
        frameColor: '#3B82F6',
        frameText: 'SCAN ME',
        options: {
            dotsOptions: { type: 'square', color: '#3B82F6' },
            cornersSquareOptions: { type: 'extra-rounded', color: '#3B82F6' },
            cornersDotOptions: { type: 'square', color: '#3B82F6' },
            backgroundOptions: { color: '#ffffff' },
        }
    },
    {
        id: 'yellow-scan',
        name: 'Yellow Alert',
        previewColor: '#F59E0B',
        frame: 'speech-bottom',
        frameColor: '#F59E0B',
        frameText: 'SCAN ME',
        options: {
            dotsOptions: { type: 'dots', color: '#F59E0B' },
            cornersSquareOptions: { type: 'dot', color: '#F59E0B' },
            cornersDotOptions: { type: 'dot', color: '#F59E0B' },
            backgroundOptions: { color: '#ffffff' },
        }
    },
    {
        id: 'purple-gradient',
        name: 'Purple Grad',
        previewColor: '#8B5CF6',
        frame: 'none',
        options: {
            dotsOptions: { 
                type: 'rounded', 
                gradient: {
                    type: 'linear',
                    rotation: 0.785398, // 45 degrees
                    colorStops: [{ offset: 0, color: '#ec4899' }, { offset: 1, color: '#8b5cf6' }]
                }
            },
            cornersSquareOptions: { type: 'extra-rounded', color: '#8b5cf6' },
            cornersDotOptions: { type: 'dot', color: '#ec4899' },
            backgroundOptions: { color: '#ffffff' },
        }
    },
    {
        id: 'dark-circle',
        name: 'Dark Circle',
        previewColor: '#1F2937',
        frame: 'circle',
        frameColor: '#1F2937',
        frameText: 'SCAN',
        options: {
            dotsOptions: { type: 'classy', color: '#1F2937' },
            cornersSquareOptions: { type: 'dot', color: '#1F2937' },
            cornersDotOptions: { type: 'dot', color: '#1F2937' },
            backgroundOptions: { color: '#ffffff' },
        }
    },
    {
        id: 'wifi-cyan',
        name: 'WiFi Cyan',
        previewColor: '#06b6d4',
        frame: 'ribbon-bottom',
        frameColor: '#06b6d4',
        frameText: 'SCAN ME',
        options: {
            dotsOptions: { type: 'dots', color: '#06b6d4' },
            cornersSquareOptions: { type: 'extra-rounded', color: '#06b6d4' },
            cornersDotOptions: { type: 'dot', color: '#06b6d4' },
            backgroundOptions: { color: '#ffffff' },
            imageOptions: { margin: 5, imageSize: 0.4 }
        }
    },
    {
        id: 'classic-black',
        name: 'Classic Black',
        previewColor: '#000000',
        frame: 'none',
        options: {
            dotsOptions: { type: 'square', color: '#000000' },
            cornersSquareOptions: { type: 'square', color: '#000000' },
            cornersDotOptions: { type: 'square', color: '#000000' },
            backgroundOptions: { color: '#ffffff' },
        }
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = qrTemplates;
}
