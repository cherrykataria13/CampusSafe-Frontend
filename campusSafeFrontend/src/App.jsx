import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginForm from './LoginForm';
import './App.css'
import Dashboard from './Dashboard';
import MyProfile from './MyProfile';
import Attendance from './components/Attendance';

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
        <Route path="/attendance/:studentId/:subjectId/:subjectName" element={<Attendance />} />
      </Routes>
    </Router>
    </div>
    );
};

export default App
