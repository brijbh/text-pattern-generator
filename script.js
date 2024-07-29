document.getElementById('generateBtn').addEventListener('click', generatePattern);
document.getElementById('close-button').addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

async function generatePattern() {
    const config = await fetchConfig();
    const canvas = document.getElementById('patternCanvas');
    const ctx = canvas.getContext('2d');
    const text = document.getElementById('userText').value;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { rotations, fontFamilies, fontWeights, numberOfTexts, fontSizeRange } = config;
    const usedPositions = []; // Array to keep track of used positions
    const errorMessages = document.getElementById('errorMessages');
    errorMessages.innerHTML = ''; // Clear previous error messages

    let failedAttempts = 0;
    let successfulAttempts = 0;

    // Generate random text patterns
    try {
        for (let i = 0; i < numberOfTexts; i++) {
            const fontSize = Math.random() * (fontSizeRange[1] - fontSizeRange[0]) + fontSizeRange[0];
            const fontFamily = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
            const fontWeight = fontWeights[Math.floor(Math.random() * fontWeights.length)];
            const rotation = rotations[Math.floor(Math.random() * rotations.length)];

            ctx.save(); // Save the current state

            // Calculate position ensuring no overlap
            let x, y;
            let positionValid = false;
            let attempts = 0;
            const maxAttempts = 5000; // Increase the number of attempts to find a valid position
            while (!positionValid && attempts < maxAttempts) {
                x = Math.random() * (canvas.width - fontSize);
                y = Math.random() * (canvas.height - fontSize);
                positionValid = !isPositionUsed(x, y, fontSize, usedPositions);
                attempts++;
            }
            if (attempts === maxAttempts) {
                console.warn(`Could not find a valid position for text instance ${i} after ${maxAttempts} attempts`);
                failedAttempts++;
                continue;
            }

            usedPositions.push({ x, y, size: fontSize });
            successfulAttempts++;

            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = getRandomColor();
            ctx.fillText(text, 0, 0);

            ctx.restore(); // Restore the state
        }
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
}

function isPositionUsed(x, y, size, usedPositions) {
    // Check if the position is already used
    for (let pos of usedPositions) {
        if (Math.abs(pos.x - x) < size && Math.abs(pos.y - y) < size) {
            return true;
        }
    }
    return false;
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
