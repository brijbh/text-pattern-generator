import React from 'react';

const ErrorModal = ({ message }) => (
  <div className="modal">
    <div className="modal-content">
      <span className="close-button" onClick={() => window.location.reload()}>&times;</span>
      <p>{message}</p>
    </div>
  </div>
);

export default ErrorModal;
