
import UserCard from './UserCard';

const UserList = ({ users, onApprove, onReject }) => (
    <div className="card-container">
      {!users || users.length === 0 ? (
        <h3>אין משתמשים חדשים לאשר.</h3>
      ) : (
        users.map((user) => (
          <UserCard 
            key={user.phoneNumber} 
            user={user} 
            onApprove={onApprove} 
            onReject={onReject} 
          />
        ))
      )}
    </div>
  );

  export default UserList;