import { Link } from 'react-router-dom';
import './landingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Campus Safe!</h1>
          <div className="cta-buttons">
          <Link to="/login" className="cta-button login-button">
            Login
          </Link>
          </div>
      </div>
      <div className="section about-section">
        <h2>About Our Website</h2>
        <p>
          Campus Safe is dedicated to ensuring the safety and well-being of students, faculty, and staff on campus. Our platform provides real-time updates, health tracking, and emergency notifications to keep everyone informed and secure.
        </p>
      </div>
      <div className="section contact-section">
        <h2>Contact Us</h2>
        <div className="contact-details">
          <p><strong>Name:</strong> Rahul Guglani, Cherry Kataria</p>
          <p><strong>Roll No:</strong> 20103116, 20103045</p>
          <p><strong>Branch:</strong> Computer Science and Engineering</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;