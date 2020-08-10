import React from 'react';

function Modal({ title, children }) {
  return (
    <div className="modal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
