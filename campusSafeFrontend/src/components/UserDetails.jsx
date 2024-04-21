import { useState, useEffect } from 'react';
import './userDetails.css';

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    fetch('http://localhost:3000/student/getDetails', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserDetails(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="user-details-container">
      <h2>User Details</h2>
      <div className="user-details">
        <p><strong>First Name:</strong> {userDetails.firstName}</p>
        <p><strong>Last Name:</strong> {userDetails.lastName}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Contact Number:</strong> {userDetails.contactNumber}</p>
      </div>
    </div>
  );
};

export default UserDetails;
