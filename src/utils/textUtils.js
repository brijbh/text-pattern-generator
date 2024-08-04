export const fillTextPatterns = (ctx, text, colors, canvas) => {
    const { width, height } = canvas;
    const numberOfTexts = 300; // Default number of texts, can be modified to be dynamic
    const rotations = [0, 15, 45, 90, -15, -45, -90];
    const fontFamilies = ["Arial", "Verdana", "Times New Roman", "Courier New", "Georgia", "Roboto", "Lobster", "Open Sans"];
    const fontWeights = ["normal", "bold", "bolder", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
    const fontSizeRange = [10, 80];

    for (let i = 0; i < numberOfTexts; i++) {
        const fontSize = Math.random() * (fontSizeRange[1] - fontSizeRange[0]) + fontSizeRange[0];
        const fontWeight = fontWeights[Math.floor(Math.random() * fontWeights.length)];
        const rotation = rotations[Math.floor(Math.random() * rotations.length)];

        ctx.save(); // Save the current state

        let x, y;
        let positionValid = false;
        let attempts = 0;
        const maxSteps = 1000;
        while (!positionValid && attempts < maxSteps) {
            x = Math.random() * (width - fontSize);
            y = Math.random() * (height - fontSize);
            positionValid = ctx.isPointInPath(x, y);
            attempts++;
        }
        if (attempts === maxSteps) {
            console.warn(`Could not find a valid position for text instance ${i} after ${maxSteps} attempts`);
            continue;
        }

        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamilies[Math.floor(Math.random() * fontFamilies.length)]}`;
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(text, 0, 0);

        ctx.restore(); // Restore the state
    }
};
