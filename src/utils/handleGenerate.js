import generatePattern from './generatePattern';
import transliterateText from './transliterateText';

const handleGenerate = ({
    userText,
    selectedLanguage,
    selectedShape,
    shapeWidth,
    shapeHeight,
    selectedColorScheme,
    setGeneratedPatternUrl,
    setShowModal,
    setModalMessage
}) => {
    try {
        const transliteratedText = transliterateText(userText, selectedLanguage);
        const patternUrl = generatePattern({
            text: transliteratedText,
            shape: selectedShape,
            width: shapeWidth,
            height: shapeHeight,
            colorScheme: selectedColorScheme
        });
        setGeneratedPatternUrl(patternUrl);
    } catch (error) {
        setModalMessage(`Transliteration error: ${error.message}`);
        setShowModal(true);
    }
};

export default handleGenerate;
