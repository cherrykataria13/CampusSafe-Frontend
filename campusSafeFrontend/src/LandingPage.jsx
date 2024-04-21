import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to Campus Safe!</h1>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button login-button">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;