import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Settings from './Settings';
import Canvas from './Canvas';
import ErrorModal from './ErrorModal';
import '../App.css';
import Sanscript from '@indic-transliteration/sanscript';

const App = () => {
  const [config, setConfig] = useState(null);
  const [pattern, setPattern] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/config.json')
      .then(response => setConfig(response.data))
      .catch(error => setError(error.message));
  }, []);

  const generatePattern = (settings) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = config.outputDimensions.width;
      canvas.height = config.outputDimensions.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let text = settings.text;
      if (settings.language !== 'en') {
        text = Sanscript.t(settings.text, 'itrans', settings.language);
      }

      ctx.save();
      switch (settings.shape) {
        case 'rectangle':
          ctx.rect(0, 0, settings.width, settings.height);
          break;
        case 'square':
          ctx.rect(0, 0, settings.width, settings.width);
          break;
        case 'circle':
          ctx.arc(settings.width / 2, settings.height / 2, settings.width / 2, 0, 2 * Math.PI);
          break;
        case 'ellipse':
          ctx.ellipse(settings.width / 2, settings.height / 2, settings.width / 2, settings.height / 2, 0, 0, 2 * Math.PI);
          break;
        case 'triangle':
          ctx.moveTo(settings.width / 2, 0);
          ctx.lineTo(settings.width, settings.height);
          ctx.lineTo(0, settings.height);
          ctx.closePath();
          break;
        default:
          ctx.rect(0, 0, canvas.width, canvas.height);
      }
      ctx.clip();

      for (let i = 0; i < config.numberOfTexts; i++) {
        const fontSize = Math.random() * (config.fontSizeRange[1] - config.fontSizeRange[0]) + config.fontSizeRange[0];
        const fontFamily = config.fontFamilies[Math.floor(Math.random() * config.fontFamilies.length)];
        const fontWeight = config.fontWeights[Math.floor(Math.random() * config.fontWeights.length)];
        const rotation = config.rotations[Math.floor(Math.random() * config.rotations.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = settings.colorScheme[Math.floor(Math.random() * settings.colorScheme.length)];
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }

      ctx.restore();
      const dataURL = canvas.toDataURL('image/jpeg');
      setPattern(dataURL);
    } catch (err) {
      setError(err.message);
    }
  };

  if (config === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>Text Pattern Generator</h1>
        <p>Generate beautiful text patterns</p>
      </div>
      <div className="content">
        <div className="settings-container">
          <Settings config={config} generatePattern={generatePattern} />
        </div>
        <div className="canvas-container">
          {pattern && <Canvas pattern={pattern} />}
        </div>
      </div>
      {error && <ErrorModal message={error} />}
    </div>
  );
};

export default App;
