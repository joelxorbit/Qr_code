document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const typeBtns = document.querySelectorAll('.type-btn');
    const dynamicInputs = document.querySelectorAll('.dynamic-input');
    const templateSelector = document.getElementById('template-selector');
    const colorDark = document.getElementById('color-dark');
    const colorFrame = document.getElementById('color-frame');
    const colorLight = document.getElementById('color-light');
    const qrSize = document.getElementById('qr-size');
    const sizeVal = document.getElementById('size-val');
    const qrError = document.getElementById('qr-error');
    const qrLogo = document.getElementById('qr-logo');
    
    const btnGenerate = document.getElementById('btn-generate');
    const btnReset = document.getElementById('btn-reset');
    
    const skeletonLoader = document.getElementById('skeleton-loader');
    const qrResult = document.getElementById('qr-result');
    const qrImage = document.getElementById('qr-image');
    const downloadActions = document.getElementById('download-actions');
    
    const themeToggle = document.getElementById('theme-toggle');
    const historyGrid = document.getElementById('history-grid');

    // Current State
    let currentType = 'url';
    let currentTemplateId = 'green-speech';
    
    // 1. Theme Toggle
    const toggleTheme = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    };
    themeToggle.addEventListener('click', toggleTheme);

    // 2. Input Type Tabs
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            dynamicInputs.forEach(i => i.classList.remove('active'));
            
            btn.classList.add('active');
            currentType = btn.getAttribute('data-type');
            document.getElementById(`input-container-${currentType}`).classList.add('active');
        });
    });

    // 3. Draw Frame Logic (Defined early so thumbnails can use it)
    const drawFrame = (qrImgDataUrl, template, size, isThumbnail = false) => {
        return new Promise((resolve) => {
            const qrImg = new Image();
            qrImg.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const frameType = template.frame || 'none';
                const fColor = colorFrame ? colorFrame.value : (template.frameColor || colorDark.value);
                const fText = template.frameText || 'SCAN ME';
                
                let w = size;
                let h = size;

                if (frameType === 'none') {
                    canvas.width = w;
                    canvas.height = h;
                    ctx.drawImage(qrImg, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/png'));
                    return;
                }

                // Add padding and room for frame
                const pad = size * 0.1;
                const topBar = size * 0.25;
                const bottomBar = size * 0.25;

                if (frameType === 'bottom-box' || frameType === 'ribbon-bottom') {
                    canvas.width = w + pad*2;
                    canvas.height = h + pad*2 + bottomBar;
                    
                    ctx.fillStyle = fColor;
                    // Draw main rounded box
                    ctx.beginPath();
                    ctx.roundRect(0, 0, canvas.width, canvas.height, 16);
                    ctx.fill();

                    // Draw white box for QR
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.roundRect(pad/2, pad/2, w + pad, h + pad, 12);
                    ctx.fill();

                    ctx.drawImage(qrImg, pad, pad, w, h);

                    // Text
                    ctx.fillStyle = '#ffffff';
                    const fontSize = isThumbnail ? size * 0.15 : size * 0.1;
                    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(fText, canvas.width/2, h + pad*1.5 + bottomBar/2);

                } else if (frameType === 'speech-top' || frameType === 'tag-top') {
                    canvas.width = w + pad*2;
                    canvas.height = h + pad*2 + topBar;
                    
                    ctx.fillStyle = fColor;
                    // Draw main rounded box
                    ctx.beginPath();
                    ctx.roundRect(0, 0, canvas.width, canvas.height, 16);
                    ctx.fill();

                    // Speech triangle if applicable
                    if (frameType === 'speech-top') {
                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.moveTo(canvas.width/2 - 15, topBar + pad/2);
                        ctx.lineTo(canvas.width/2 + 15, topBar + pad/2);
                        ctx.lineTo(canvas.width/2, topBar + pad/2 + 15);
                        ctx.fill();
                    }

                    // Draw white box for QR
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.roundRect(pad/2, topBar + pad/2, w + pad, h + pad, 12);
                    ctx.fill();

                    ctx.drawImage(qrImg, pad, topBar + pad, w, h);

                    // Text
                    ctx.fillStyle = '#ffffff';
                    const fontSize = isThumbnail ? size * 0.15 : size * 0.1;
                    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(fText, canvas.width/2, topBar/2 + pad/4);
                    
                } else if (frameType === 'circle') {
                    canvas.width = w + pad*4;
                    canvas.height = h + pad*4;
                    const center = canvas.width/2;

                    // Colored Circle
                    ctx.fillStyle = fColor;
                    ctx.beginPath();
                    ctx.arc(center, center, canvas.width/2, 0, 2*Math.PI);
                    ctx.fill();

                    // White Circle
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(center, center, canvas.width/2 - pad, 0, 2*Math.PI);
                    ctx.fill();

                    ctx.drawImage(qrImg, pad*2, pad*2, w, h);

                    // Curved Text could be complex, placing it at the bottom inside colored ring
                    ctx.fillStyle = '#ffffff';
                    const fontSize = isThumbnail ? size * 0.12 : size * 0.08;
                    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(fText, center, canvas.height - pad/2);
                } else {
                    // Fallback
                    canvas.width = w;
                    canvas.height = h;
                    ctx.drawImage(qrImg, 0, 0, w, h);
                }

                resolve(canvas.toDataURL('image/png'));
            };
            qrImg.src = qrImgDataUrl;
        });
    };

    // 4. Render Templates
    const renderTemplates = () => {
        if (typeof qrTemplates === 'undefined') return;
        
        templateSelector.innerHTML = '';
        qrTemplates.forEach(template => {
            const el = document.createElement('div');
            el.className = `template-card ${template.id === currentTemplateId ? 'active' : ''}`;
            el.dataset.id = template.id;
            
            el.innerHTML = `
                <div class="template-preview-img-container" id="preview-img-${template.id}">
                   <div style="font-size: 10px; color: #999;">Loading...</div>
                </div>
                <div class="template-name">${template.name}</div>
            `;
            
            el.addEventListener('click', () => {
                document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
                el.classList.add('active');
                currentTemplateId = template.id;
                
                // Set color pickers based on template if applicable
                if (template.options.dotsOptions.color) {
                    colorDark.value = template.options.dotsOptions.color;
                }
                if (template.frameColor) {
                    colorFrame.value = template.frameColor;
                } else if (template.options.dotsOptions.color) {
                    colorFrame.value = template.options.dotsOptions.color;
                }
                if (template.options.backgroundOptions.color) {
                    colorLight.value = template.options.backgroundOptions.color;
                }
            });
            
            templateSelector.appendChild(el);
        });

        // Generate Thumbnails
        const generateThumbnails = async () => {
            // Wait for library to load
            while(typeof QRCodeStyling === 'undefined') {
                await new Promise(r => setTimeout(r, 100));
            }

            for (const template of qrTemplates) {
                try {
                    let options = JSON.parse(JSON.stringify(template.options));
                    options.data = 'SCAN ME';
                    options.width = 100;
                    options.height = 100;
                    options.margin = 5;
                    
                    const qrCode = new QRCodeStyling(options);
                    const rawBlob = await qrCode.getRawData('png');
                    const rawDataUrl = URL.createObjectURL(rawBlob);
                    
                    const finalDataUrl = await drawFrame(rawDataUrl, template, 100, true);
                    
                    const container = document.getElementById(`preview-img-${template.id}`);
                    if (container) {
                        container.innerHTML = `<img src="${finalDataUrl}" alt="${template.name}">`;
                    }
                } catch (e) {
                    console.error('Thumbnail error', e);
                }
            }
        };

        generateThumbnails();
    };
    renderTemplates();

    // 5. Update Size Value
    qrSize.addEventListener('input', (e) => {
        sizeVal.textContent = e.target.value;
    });

    // 6. Toast Notifications
    const showToast = (message, type = 'success') => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-exclamation"></i>';
        
        toast.innerHTML = `${icon} <span>${message}</span>`;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // 7. Generate Logic
    const getInputValue = () => {
        let text = '';
        switch(currentType) {
            case 'url':
                text = document.getElementById('qr-input-url').value;
                break;
            case 'text':
                text = document.getElementById('qr-input-text').value;
                break;
            case 'email':
                const email = document.getElementById('qr-input-email').value;
                if(email) text = `mailto:${email}`;
                break;
            case 'phone':
                const phone = document.getElementById('qr-input-phone').value;
                if(phone) text = `tel:${phone}`;
                break;
            case 'wifi':
                const ssid = document.getElementById('qr-input-wifi-ssid').value;
                const pass = document.getElementById('qr-input-wifi-pass').value;
                const type = document.getElementById('qr-input-wifi-type').value;
                if(ssid) {
                    text = `WIFI:T:${type};S:${ssid};P:${pass};;`;
                }
                break;
        }
        return text;
    };

    const generateQRCode = async () => {
        const text = getInputValue();
        
        if (!text) {
            showToast('Please enter the required information.', 'error');
            return null;
        }

        qrImage.style.display = 'none';
        skeletonLoader.classList.add('active');
        downloadActions.classList.remove('active');

        try {
            const template = qrTemplates.find(t => t.id === currentTemplateId);
            const size = parseInt(qrSize.value, 10);
            
            // Base options from template
            let options = JSON.parse(JSON.stringify(template.options)); // Deep copy
            options.data = text;
            options.width = size;
            options.height = size;
            options.margin = 10;
            
            // Apply custom colors if not gradient
            if (!options.dotsOptions.gradient) {
                options.dotsOptions.color = colorDark.value;
            }
            if (options.cornersSquareOptions && !options.cornersSquareOptions.gradient) {
                options.cornersSquareOptions.color = colorDark.value;
            }
            if (options.cornersDotOptions && !options.cornersDotOptions.gradient) {
                options.cornersDotOptions.color = colorDark.value;
            }
            
            options.backgroundOptions.color = colorLight.value;
            
            options.qrOptions = {
                errorCorrectionLevel: qrError.value || 'M'
            };

            // Logo Support
            if (qrLogo.files && qrLogo.files[0]) {
                const logoDataUrl = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(qrLogo.files[0]);
                });
                options.image = logoDataUrl;
                options.imageOptions = {
                    crossOrigin: "anonymous",
                    margin: 5,
                    imageSize: 0.4
                };
            }

            // Generate raw QR Code using qr-code-styling
            const qrCode = new QRCodeStyling(options);
            const rawBlob = await qrCode.getRawData('png');
            const rawDataUrl = URL.createObjectURL(rawBlob);

            // Draw Frame
            const finalDataUrl = await drawFrame(rawDataUrl, template, size);
            
            return { dataUrl: finalDataUrl, text };
            
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to generate QR Code', 'error');
            return null;
        }
    };

    btnGenerate.addEventListener('click', async () => {
        if (typeof QRCodeStyling === 'undefined') {
            showToast('QR Library still loading, please wait...', 'error');
            return;
        }
        
        const result = await generateQRCode();
        if (result) {
            skeletonLoader.classList.remove('active');
            qrImage.src = result.dataUrl;
            qrImage.style.display = 'block';
            downloadActions.classList.add('active');
            
            showToast('QR Code Generated!');
            
            saveToHistory(result.dataUrl, result.text);
            loadHistory();
        } else {
            skeletonLoader.classList.remove('active');
        }
    });

    // 8. Download Handlers
    const downloadFile = (url, extension) => {
        const a = document.createElement('a');
        a.href = url;
        const date = new Date();
        const timestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
        a.download = `qr-code-${timestamp}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(`Downloaded as ${extension.toUpperCase()}`);
    };

    document.getElementById('btn-download-png').addEventListener('click', () => {
        downloadFile(qrImage.src, 'png');
    });

    document.getElementById('btn-download-svg').addEventListener('click', () => {
        showToast('Only PNG is supported for advanced frames', 'error');
    });

    document.getElementById('btn-download-jpeg').addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            downloadFile(canvas.toDataURL('image/jpeg', 1.0), 'jpg');
        };
        img.src = qrImage.src;
    });

    // 9. History
    const saveToHistory = (dataUrl, text) => {
        let history = JSON.parse(localStorage.getItem('qr_history') || '[]');
        history.unshift({
            url: dataUrl,
            text: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
            date: new Date().toLocaleDateString()
        });
        if (history.length > 8) history = history.slice(0, 8);
        localStorage.setItem('qr_history', JSON.stringify(history));
    };

    const loadHistory = () => {
        const history = JSON.parse(localStorage.getItem('qr_history') || '[]');
        if (history.length === 0) {
            historyGrid.innerHTML = '<p class="empty-state">No recent QR codes found.</p>';
            return;
        }
        historyGrid.innerHTML = '';
        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item fade-in';
            div.innerHTML = `
                <img src="${item.url}" class="history-img" alt="History QR">
                <div class="history-date">${item.date}</div>
                <div class="template-name" style="margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.text}</div>
            `;
            historyGrid.appendChild(div);
        });
    };

    loadHistory();

    // 10. Reset Button
    btnReset.addEventListener('click', () => {
        document.querySelectorAll('input:not([type="color"]):not([type="range"]), textarea').forEach(el => el.value = '');
        qrImage.style.display = 'none';
        downloadActions.classList.remove('active');
        qrSize.value = 300;
        sizeVal.textContent = '300';
        showToast('Form reset', 'success');
    });

});
