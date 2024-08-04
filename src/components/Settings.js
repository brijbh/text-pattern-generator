import React from 'react';

const Settings = ({
    userText,
    setUserText,
    selectedLanguage,
    setSelectedLanguage,
    selectedShape,
    setSelectedShape,
    shapeWidth,
    setShapeWidth,
    shapeHeight,
    setShapeHeight,
    selectedColorScheme,
    setSelectedColorScheme,
    config
}) => {
    if (!config) return <div>Loading...</div>;

    return (
        <div>
            <div>
                <label>
                    Text:
                    <input
                        type="text"
                        value={userText}
                        onChange={e => setUserText(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Language:
                    <select
                        value={selectedLanguage}
                        onChange={e => setSelectedLanguage(e.target.value)}
                    >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                        <option value="bn">Bengali</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Shape:
                    <select
                        value={selectedShape}
                        onChange={e => setSelectedShape(e.target.value)}
                    >
                        <option value="rectangle">Rectangle</option>
                        <option value="square">Square</option>
                        <option value="circle">Circle</option>
                        <option value="ellipse">Ellipse</option>
                        <option value="triangle">Triangle</option>
                    </select>
                </label>
            </div>
            {selectedShape === 'rectangle' || selectedShape === 'square' ? (
                <>
                    <div>
                        <label>
                            Width:
                            <input
                                type="range"
                                min="1"
                                max={config.maxDimensions[selectedShape]}
                                value={shapeWidth}
                                onChange={e => setShapeWidth(Number(e.target.value))}
                            />
                        </label>
                    </div>
                    {selectedShape === 'rectangle' && (
                        <div>
                            <label>
                                Height:
                                <input
                                    type="range"
                                    min="1"
                                    max={config.maxDimensions[selectedShape]}
                                    value={shapeHeight}
                                    onChange={e => setShapeHeight(Number(e.target.value))}
                                />
                            </label>
                        </div>
                    )}
                </>
            ) : null}
            <div>
                <label>
                    Color Scheme:
                    <div>
                        {Object.entries(config.colorSchemes).map(([scheme, colors]) => (
                            <label key={scheme}>
                                <input
                                    type="radio"
                                    name="colorScheme"
                                    value={scheme}
                                    checked={selectedColorScheme === scheme}
                                    onChange={e => setSelectedColorScheme(e.target.value)}
                                />
                                <div style={{ display: 'flex' }}>
                                    {colors.map(color => (
                                        <div
                                            key={color}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: color,
                                                margin: '2px'
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </label>
                        ))}
                        <label>
                            <input
                                type="radio"
                                name="colorScheme"
                                value="random"
                                checked={selectedColorScheme === 'random'}
                                onChange={e => setSelectedColorScheme(e.target.value)}
                            />
                            Random
                        </label>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default Settings;
