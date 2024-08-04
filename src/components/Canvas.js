import React from 'react';

const Canvas = ({ pattern }) => (
  <div>
    <img src={pattern}  alt="Generated Pattern" />
    <a href={pattern} download="pattern.jpg">Download Image</a>
  </div>
);

export default Canvas;
