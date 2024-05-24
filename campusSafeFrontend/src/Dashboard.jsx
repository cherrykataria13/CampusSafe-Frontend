import { useState, useEffect } from 'react'; 
import './dashboard.css';
import Topbar from './Topbar';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';

const Dashboard = () => {
  const [userType, setUserType ]= useState('student');
  const [userId, setUserId ] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkToken = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/');
      return false;
    }
    
    try {
      const response = await fetch('http://localhost:8080/user/checkToken', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        localStorage.removeItem('accessToken');
        navigate('/');
        return false;
      }
  
      const data = await response.json();
      setUserType(data.userType);
      setUserId(data.userId);
      console.log(userId);
      setLoading(false);
  
      return true;
    } catch (error) {
      console.error('Error checking token:', error);
      localStorage.removeItem('accessToken');
      navigate('/');
      return false;
    }
  };
  

  useEffect(() => {
    checkToken();
  },[]);

  
  const getDashboard = () => {
    switch(userType) {
      case 'student':
        return <StudentDashboard userId={userId}/>;
      case 'teacher':
        return <TeacherDashboard userId={userId}/>;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <h2>Unauthorized Access</h2>; // or any other fallback component
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
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
