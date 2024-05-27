import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginForm from './LoginForm';
import './App.css'
import Dashboard from './Dashboard';
import MyProfile from './MyProfile';
import AddLecture from './components/AddLecture';
import Attendance from './components/Attendance';
import LectureDetail from './components/LectureDetail';
import ClassDetails from './components/ClassDetails';

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
        <Route path="/attendance/:studentId/:subjectId" element={<Attendance />} />
        <Route path="/addLecture/:classId/:subjectId" element={<AddLecture />} />
        <Route path="/lecture/:classId/:subjectId/:lectureId" element={<LectureDetail />} />
        <Route path="/class/:classId" element={<ClassDetails/>} />
      </Routes>
    </Router>
    </div>
    );
};

export default App
