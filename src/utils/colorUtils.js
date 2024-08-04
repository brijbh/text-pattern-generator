export const generateRandomColorScheme = () => {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        colors.push(getRandomColor());
    }
    return colors;
};

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
