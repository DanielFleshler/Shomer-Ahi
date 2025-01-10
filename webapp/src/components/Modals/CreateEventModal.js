import React from 'react';
import '../../styles/components/Modal.css';




const CreateEventModal = ({ onClose, onConfirm }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>יצירת אירוע חדש</h2>
          <button onClick={onClose} className="close-button">X</button>
        </div>
        <div className="modal-body">
          <p>האם ברצונך ליצור אירוע חדש במיקום זה?</p>
          <div className="buttons">
            <button onClick={() => onConfirm(true)} className="approve-button">
              כן
            </button>
            <button onClick={() => onConfirm(false)} className="reject-button">
              לא
            </button>
          </div>
        </div>
      </div>
    </div>
  );

export default CreateEventModal;