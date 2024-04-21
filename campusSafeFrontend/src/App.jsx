import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginForm from './LoginForm';
import './App.css'
import Dashboard from './Dashboard';
import MyProfile from './MyProfile';

const App = () => {
  return (
    <div className='app'>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path='/friends' element={<Friends />} /> */}
        <Route path='/profile' element={<MyProfile/>} />
      </Routes>
    </Router>
    </div>
    );
};

export default App
