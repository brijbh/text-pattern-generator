import React from 'react';

const Modal = ({ message, onClose }) => (
    <div className="modal" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-button" onClick={onClose}>&times;</span>
            <p>{message}</p>
        </div>
    </div>
);

export default Modal;
