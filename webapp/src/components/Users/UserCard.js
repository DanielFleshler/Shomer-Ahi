import '../../styles/components/UserCard.css';

const UserCard = ({ user, onApprove, onReject }) => {
    return (
      <div className="user-card" dir="rtl">
        <h3>
          שם מלא: {user.firstName} {user.lastName}
        </h3>
        <p>מספר פלאפון: {user.phoneNumber}</p>
        <p>אימייל: {user.email}</p>
        <p>מספר רישיון: {user.licenseNumber}</p>
        
        <div className="buttons">
          <button
            onClick={() => onApprove(user.phoneNumber)}
            className="approve-button"
          >
            אישור
          </button>
          <button
            onClick={() => onReject(user.phoneNumber, user.email)}
            className="reject-button"
          >
            דחייה
          </button>
        </div>
      </div>
    );
  };
  
  export default UserCard;