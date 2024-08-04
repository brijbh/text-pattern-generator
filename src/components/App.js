import React, { useState, useEffect } from 'react';
import Settings from './Settings';
import Canvas from './Canvas';
import ErrorModal from './ErrorModal';
import generatePattern from '../utils/generatePattern';
import transliterateText from '../utils/transliterateText';
import '../App.css';

const App = () => {
    const [userText, setUserText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [selectedShape, setSelectedShape] = useState('rectangle');
    const [shapeWidth, setShapeWidth] = useState(500);
    const [shapeHeight, setShapeHeight] = useState(500);
    const [selectedColorScheme, setSelectedColorScheme] = useState('scheme1');
    const [generatedImage, setGeneratedImage] = useState('');
    const [config, setConfig] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/config.json')
            .then(response => response.json())
            .then(data => setConfig(data))
            .catch(err => setError('Failed to load configuration'));
    }, []);

    const handleGenerate = () => {
        if (!config) return;

        try {
            const transliteratedText = transliterateText(userText, selectedLanguage);
            const patternDataUrl = generatePattern({
                text: transliteratedText,
                shape: selectedShape,
                width: shapeWidth,
                height: shapeHeight,
                colorScheme: selectedColorScheme,
                config
            });
            setGeneratedImage(patternDataUrl);
        } catch (err) {
            setError('Pattern generation failed');
        }
    };

    return (
        <div className="container">
            <div className="settings">
                <Settings
                    userText={userText}
                    setUserText={setUserText}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                    selectedShape={selectedShape}
                    setSelectedShape={setSelectedShape}
                    shapeWidth={shapeWidth}
                    setShapeWidth={setShapeWidth}
                    shapeHeight={shapeHeight}
                    setShapeHeight={setShapeHeight}
                    selectedColorScheme={selectedColorScheme}
                    setSelectedColorScheme={setSelectedColorScheme}
                    config={config}
                />
                <button onClick={handleGenerate}>Generate Pattern</button>
                {error && <ErrorModal message={error} onClose={() => setError('')} />}
            </div>
            <div className="output">
                {generatedImage && (
                    <div>
                        <img src={generatedImage} alt="Generated Pattern" />
                        <a href={generatedImage} download="pattern.jpg">Download Image</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
