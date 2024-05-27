import './topbar.css';
import { useState, useEffect } from 'react';
import Modal from './components/Modal';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiUser, FiLogOut } from 'react-icons/fi';


const Topbar = ()=>{

  const [userDetails, setUserDetails] = useState({firstName:"user"});
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const backend_url= process.env.backend_url;

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  const handleLogout = () =>{
    localStorage.removeItem('accessToken');
    console.log('Logout successful');
    navigate('/');
  }

  const openFriendsPage = ()=>{
    navigate('/friends');
  }
  
  const openDashboardPage = ()=>{
    navigate('/dashboard');
  }
  
  const openProfilePage = ()=>{
    navigate('/profile');
  }
  
  const openComparePage = ()=>{
    navigate('/compare');
  }
  
  // useEffect(() => {
  //   // Fetch user details from the backend API using the access token
  //   fetch(`${backend_url}:3000/student/getDetails`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setUserDetails(data);
  //     })
  //     .catch((error) => console.error(error));
  //   },[]);

  return (

  <div>
      <div className="top-bar">
        <div className="menu-icon" onClick={toggleMenu}>Menu</div>
        <h1 className="study-sphere-logo">Campus Safe</h1>
        <div className="right-icons">
          <FiBell className="icon bell-icon" />
          <FiUser className="icon user-icon" onClick={openProfilePage} />
          <FiLogOut className="icon logout-icon" onClick={handleLogout} />
        </div>
        
      <div className={`menu-panel ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-options">
          <div className="menu-option" onClick={openDashboardPage}>Dashboard</div>
          <div className="menu-option" onClick={openProfilePage}>My Profile</div>
        </div>
      </div>
    </div>


    {/* // <div>
    // <div className="top-bar">
    //   <div className="menu-icon" onClick={toggleMenu} >Menu</div>
    //   <h1 className="study-sphere-logo">Campus Safe</h1>
    //   <div className="user-icon">
    //     <Modal modalName = {userDetails.firstName} data = "userDetails" />
    //   <button className="logout-btn"onClick={handleLogout}>Logout</button>
    //   </div>
    // </div>
    // <div className={`menu-panel ${isMenuOpen ? 'open' : ''}`}>
    //     <div className="menu-options">
    //       <div className="menu-option" onClick={openDashboardPage}>Dashboard</div>
    //       <div className="menu-option" onClick={openProfilePage}>My Profile</div>
    //     </div>
    //   </div> */}

    </div>
  );
};

export default Topbar;