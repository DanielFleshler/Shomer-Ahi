import React from 'react';
import UserList from '../Users/UserList';
import '../../styles/components/Modal.css';

const UserApprovalModal = ({ 
  show, 
  onClose, 
  userData, 
  onApprove, 
  onReject 
}) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>אישור משתמשים חדשים</h2>
        <button onClick={onClose} className="close-button">X</button>
      </div>
      <div className="modal-body">
        <UserList 
          users={userData} 
          onApprove={onApprove} 
          onReject={onReject} 
        />
      </div>
    </div>
  </div>
);

export default UserApprovalModal;