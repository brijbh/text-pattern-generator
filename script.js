document.getElementById('generateBtn').addEventListener('click', generatePattern);
document.getElementById('close-button').addEventListener('click', closeModal);
document.getElementById('shapeSelect').addEventListener('change', toggleShapeDimensions);
document.getElementById('languageSelect').addEventListener('change', updateLanguage);
window.addEventListener('click', outsideClick);

let targetLanguage = 'en'; // Default to English

function toggleShapeDimensions() {
    const shape = document.getElementById('shapeSelect').value;
    const shapeDimensions = document.getElementById('shapeDimensions');
    shapeDimensions.style.display = (shape === 'rectangle' || shape === 'square') ? 'block' : 'none';
}

function updateLanguage() {
    const language = document.getElementById('languageSelect').value;
    switch (language) {
        case 'hindi':
            targetLanguage = 'hi';
            break;
        case 'tamil':
            targetLanguage = 'ta';
            break;
        case 'telugu':
            targetLanguage = 'te';
            break;
        case 'bengali':
            targetLanguage = 'bn';
            break;
        case 'french':
            targetLanguage = 'fr';
            break;
        case 'spanish':
            targetLanguage = 'es';
            break;
        default:
            targetLanguage = 'en';
    }
}

function transliterateText(text, language) {
    try {
        switch (language) {
            case 'hi':
                return Sanscript.t(text, 'itrans', 'devanagari');
            case 'ta':
                return Sanscript.t(text, 'itrans', 'tamil');
            case 'te':
                return Sanscript.t(text, 'itrans', 'telugu');
            case 'bn':
                return Sanscript.t(text, 'itrans', 'bengali');
            case 'fr':
            case 'es':
                // Use original text for French and Spanish as no transliteration is needed
                return text;
            default:
                return text;
        }
    } catch (error) {
        console.error('Error with transliteration:', error);
        return text; // Fallback to original text if transliteration fails
    }
}

async function generatePattern() {
    const config = await fetchConfig();
    const canvas = document.getElementById('patternCanvas');
    const ctx = canvas.getContext('2d');
    const { width, height } = config.outputDimensions;
    canvas.width = width;
    canvas.height = height;

    let text = document.getElementById('userText').value;
    const shape = document.getElementById('shapeSelect').value;
    const colorScheme = document.querySelector('input[name="colorScheme"]:checked').value;
    const bgColor = document.getElementById('bgColor').value;

    let shapeWidth = Math.min(parseInt(document.getElementById('shapeWidth').value) || 500, width);
    let shapeHeight = Math.min(parseInt(document.getElementById('shapeHeight').value) || 500, height);

    if (shape === 'square') {
        shapeHeight = shapeWidth;
    }

    let selectedColors = colorScheme === 'random' ? generateRandomColorScheme() : config.colorSchemes[colorScheme];

    // Adjust number of texts based on shape size
    const maxShapeArea = width * height;
    const shapeArea = shapeWidth * shapeHeight;
    const numberOfTexts = Math.floor(config.numberOfTexts * (shapeArea / maxShapeArea));

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { rotations, fontFamilies, fontWeights, fontSizeRange, maxSteps } = config;
    const errorMessages = document.getElementById('errorMessages');
    errorMessages.innerHTML = ''; // Clear previous error messages

    let failedAttempts = 0;
    let successfulAttempts = 0;

    // Transliterated text based on the selected language
    const transliteratedText = transliterateText(text, targetLanguage);

    // Draw shape
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (shape === 'rectangle' || shape === 'square') {
        ctx.rect((canvas.width - shapeWidth) / 2, (canvas.height - shapeHeight) / 2, shapeWidth, shapeHeight);
    } else if (shape === 'circle') {
        ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(shapeWidth, shapeHeight) / 2, 0, 2 * Math.PI);
    } else if (shape === 'ellipse') {
        ctx.ellipse(canvas.width / 2, canvas.height / 2, shapeWidth / 2, shapeHeight / 2, 0, 0, 2 * Math.PI);
    } else if (shape === 'triangle') {
        const startX = (canvas.width - shapeWidth) / 2;
        const startY = (canvas.height + shapeHeight) / 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + shapeWidth, startY);
        ctx.lineTo(startX + shapeWidth / 2, startY - shapeHeight);
        ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
    ctx.clip();

    // Generate random text patterns
    try {
        fillTextPatterns(ctx, transliteratedText, selectedColors, numberOfTexts, rotations, fontFamilies, fontWeights, fontSizeRange, canvas, shapeWidth, shapeHeight, maxSteps);
    } catch (error) {
        errorMessages.innerHTML += `<p>Application error: ${error.message}</p>`;
    }

    if (failedAttempts > 0) {
        showModal(`Could not place ${failedAttempts} text instances due to space constraints.`);
    }

    // Show download link
    if (successfulAttempts > 0) {
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = canvas.toDataURL('image/jpeg');
        downloadLink.style.display = 'inline-block';
    }

    ctx.restore();
}

function fillTextPatterns(ctx, text, colors, numberOfTexts, rotations, fontFamilies, fontWeights, fontSizeRange, canvas, shapeWidth, shapeHeight, maxSteps) {
    let failedAttempts = 0;
    let successfulAttempts = 0;

    for (let i = 0; i < numberOfTexts; i++) {
        const fontSize = Math.random() * (fontSizeRange[1] - fontSizeRange[0]) + fontSizeRange[0];
        const fontWeight = fontWeights[Math.floor(Math.random() * fontWeights.length)];
        const rotation = rotations[Math.floor(Math.random() * rotations.length)];

        ctx.save(); // Save the current state

        // Calculate position ensuring no overlap
        let x, y;
        let positionValid = false;
        let attempts = 0;
        while (!positionValid && attempts < maxSteps)
            while (!positionValid && attempts < maxSteps) {
                x = Math.random() * (canvas.width - fontSize);
                y = Math.random() * (canvas.height - fontSize);
                positionValid = ctx.isPointInPath(x, y);
                attempts++;
            }
            if (attempts === maxSteps) {
                console.warn(`Could not find a valid position for text instance ${i} after ${maxSteps} attempts`);
                failedAttempts++;
                continue;
            }
    
            successfulAttempts++;
    
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamilies[Math.floor(Math.random() * fontFamilies.length)]}`;
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillText(text, 0, 0);
    
            ctx.restore(); // Restore the state
        }
    
        // Second pass for smaller text to fill white space
        for (let i = 0; i < numberOfTexts; i++) {
            const fontSize = Math.random() * (fontSizeRange[0] - 5) + 5; // Smaller font size
            const fontWeight = fontWeights[Math.floor(Math.random() * fontWeights.length)];
            const rotation = rotations[Math.floor(Math.random() * rotations.length)];
    
            ctx.save(); // Save the current state
    
            // Calculate position ensuring no overlap
            let x, y;
            let positionValid = false;
            let attempts = 0;
            while (!positionValid && attempts < maxSteps) {
                x = Math.random() * (canvas.width - fontSize);
                y = Math.random() * (canvas.height - fontSize);
                positionValid = ctx.isPointInPath(x, y);
                attempts++;
            }
            if (attempts === maxSteps) {
                console.warn(`Could not find a valid position for text instance ${i} after ${maxSteps} attempts`);
                failedAttempts++;
                continue;
            }
    
            successfulAttempts++;
    
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamilies[Math.floor(Math.random() * fontFamilies.length)]}`;
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillText(text, 0, 0);
    
            ctx.restore(); // Restore the state
        }
    }
    
    function generateRandomColorScheme() {
        const colors = [];
        for (let i = 0; i < 5; i++) {
            colors.push(getRandomColor());
        }
        return colors;
    }
    
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    async function fetchConfig() {
        try {
            const response = await fetch('config.json');
            if (!response.ok) {
                throw new Error('Failed to load config file');
            }
            return await response.json();
        } catch (error) {
            document.getElementById('errorMessages').innerHTML = `<p>Error loading configuration: ${error.message}</p>`;
            throw error;
        }
    }
    
    function showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.innerText = message;
        modal.style.display = 'block';
    }
    
    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }
    
    function outsideClick(event) {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    