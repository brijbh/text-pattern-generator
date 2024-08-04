import React, { useState } from 'react';

const Settings = ({ config, generatePattern }) => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [shape, setShape] = useState('rectangle');
  const [colorScheme, setColorScheme] = useState(config.colorSchemes.scheme1);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);

  const handleGenerate = () => {
    generatePattern({ text, language, shape, colorScheme, width, height });
  };

  return (
    <div>
      <label>Enter Text:</label>
      <input type="text" value={text} onChange={e => setText(e.target.value)} maxLength={config.maxCharacters} />
      
      <label>Select Language:</label>
      <select value={language} onChange={e => setLanguage(e.target.value)}>
        {Object.entries(config.languages).map(([lang, code]) => (
          <option key={code} value={code}>{lang}</option>
        ))}
      </select>

      <label>Select Shape:</label>
      <div className="shape-selection">
        {Object.keys(config.maxDimensions).map(shapeOption => (
          <label key={shapeOption}>
            <input type="radio" name="shape" value={shapeOption} checked={shape === shapeOption} onChange={e => setShape(e.target.value)} />
            <img src={`${process.env.PUBLIC_URL}/assets/${shapeOption}.png`} alt={shapeOption} />
          </label>
        ))}
      </div>

      <label>Select Color Scheme:</label>
      <div>
        {Object.entries(config.colorSchemes).map(([scheme, colors]) => (
          <label key={scheme}>
            <input type="radio" name="colorScheme" value={scheme} checked={colorScheme === colors} onChange={() => setColorScheme(colors)} />
            <div style={{ display: 'flex' }}>
              {colors.map(color => (
                <div key={color} style={{ width: '20px', height: '20px', backgroundColor: color, margin: '2px' }}></div>
              ))}
            </div>
          </label>
        ))}
      </div>

      {shape === 'rectangle' || shape === 'square' ? (
        <div>
          <label>Width:</label>
          <input type="range" value={width} min="1" max={config.maxDimensions[shape]} onChange={e => setWidth(e.target.value)} />
          {shape === 'rectangle' && (
            <>
              <label>Height:</label>
              <input type="range" value={height} min="1" max={config.maxDimensions[shape]} onChange={e => setHeight(e.target.value)} />
            </>
          )}
        </div>
      ) : null}

      <button onClick={handleGenerate}>Generate Pattern</button>
      <p className="disclaimer">Note: The text in native languages may not be accurate due to machine translation.</p>
    </div>
  );
};

export default Settings;
