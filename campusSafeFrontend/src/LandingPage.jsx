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
          <p><strong>Email:</strong> support@campussafe.com</p>
          <p><strong>Phone:</strong> +123-456-7890</p>
          <p><strong>Address:</strong> 123 Campus Road, University City</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;