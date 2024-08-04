import Sanscript from '@indic-transliteration/sanscript';

const transliterateText = (text, language) => {
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
                return text; // No transliteration needed for French and Spanish
            default:
                return text;
        }
    } catch (error) {
        console.error('Error with transliteration:', error);
        throw new Error('Transliteration failed');
    }
};

export default transliterateText;
