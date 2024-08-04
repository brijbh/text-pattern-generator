import { generateRandomColorScheme } from './colorUtils';
import { fillTextPatterns } from './textUtils';

const generatePattern = ({ text, shape, width, height, colorScheme, config }) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = config.outputDimensions.width;
    canvas.height = config.outputDimensions.height;

    const selectedColors = colorScheme === 'random' ? generateRandomColorScheme() : config.colorSchemes[colorScheme];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (shape === 'rectangle' || shape === 'square') {
        ctx.rect((canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    } else if (shape === 'circle') {
        ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
    } else if (shape === 'ellipse') {
        ctx.ellipse(canvas.width / 2, canvas.height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
    } else if (shape === 'triangle') {
        const startX = (canvas.width - width) / 2;
        const startY = (canvas.height + height) / 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + width, startY);
        ctx.lineTo(startX + width / 2, startY - height);
        ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
    ctx.clip();

    fillTextPatterns(ctx, text, selectedColors, canvas);

    ctx.restore();
    return canvas.toDataURL('image/jpeg');
};

export default generatePattern;
