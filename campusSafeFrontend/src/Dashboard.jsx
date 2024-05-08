import { useState, useEffect } from 'react'; 
import './dashboard.css';
import Topbar from './Topbar';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';

const Dashboard = () => {
  const [userType, setUserType ]= useState('student');
  const navigate = useNavigate();

  const checkToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/');
      return false;
    }
    fetch('http://localhost:8080/user/checkToken', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        localStorage.removeItem('accessToken');
        navigate('/');
      }
      return response.json();
    })
    .then(data => {
      setUserType(data.userType);
      console.log(data.userId);
    })
    .catch(error => {
      console.error('Error checking token:', error);
    });
  }

  useEffect(() => {
    checkToken();
  },[]);

  
  const getDashboard = () => {
    switch(userType) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <h2>Unauthorized Access</h2>; // or any other fallback component
    }
  };
  
  return (
    <div className="dashboard-container">
      <Topbar />
      <div className="dashboard-content">
        <h1 className="dashboard-heading">Dashboard</h1>
        {getDashboard()}
      </div>
    </div>
  );
  
};

export default Dashboard;
