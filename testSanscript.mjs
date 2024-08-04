import transliterate from '@sindresorhus/transliterate';

const text = 'Hello';
const targetLanguage = 'hi'; // Example target language

(async () => {
    try {
        console.log(`Transliterating text: ${text} to language: ${targetLanguage}`);
        const transliteratedText = transliterate(text);
        console.log(`Transliterated text: ${transliteratedText}`);
        if (!transliteratedText) {
            throw new Error('Transliteration returned undefined or empty result');
        }
    } catch (e) {
        console.error(`Transliteration error: ${e.message}`);
    }
})();
