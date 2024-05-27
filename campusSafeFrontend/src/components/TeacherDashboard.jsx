import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './teacherDashboard.css';

const TeacherDashboard = ({ userId }) => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [lectures, setLectures] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const navigate = useNavigate();
  const backend_url= process.env.backend_url;

  // Fetch teacher info based on userId
  useEffect(() => {
    fetch(`${backend_url}:8080/teacher/teacher/${userId}`)
      .then(response => response.json())
      .then(data => setTeacherInfo(data.data))
      .catch(error => console.error('Error fetching teacher info', error));
  }, [userId]);

  // Fetch classes data
  useEffect(() => {
    if(teacherInfo){
    fetch(`${backend_url}:8080/teacher/classes/${teacherInfo.teacher_id}`)
      .then(response => response.json())
      .then(data => setClasses(data.classes))
      .catch(error => console.error('Error fetching classes', error));
}
}, [teacherInfo]);

  // Fetch subjects data when selectedClass changes
  useEffect(() => {
    if (teacherInfo&&selectedClass) {
      fetch(`${backend_url}:8080/teacher/subjects/${teacherInfo.teacher_id}/${selectedClass}`)
        .then(response => response.json())
        .then(data => setSubjects(data.subjects))
        .catch(error => console.error('Error fetching subjects', error));
    }
  }, [selectedClass,teacherInfo]);

  // Fetch lectures data when selectedSubject changes
  useEffect(() => {
    if (selectedSubject) {
      fetch(`${backend_url}:8080/teacher/lectures/${selectedClass}/${selectedSubject}`)
        .then(response => response.json())
        .then(data => setLectures(data.lectures))
        .catch(error => console.error('Error fetching lectures', error));
    }
  }, [selectedSubject]);

  const handleLectureClick = (lectureId) => {
    navigate(`/lecture/${selectedClass}/${selectedSubject}/${lectureId}`);
  };

  // Function to handle adding a new lecture
  const handleAddLecture = () => {
    // Logic to add a new lecture
    console.log('Adding a new lecture...');
    navigate(`/addLecture/${selectedClass}/${selectedSubject}`);
  };

  if (!teacherInfo) {
    return <p>Loading teacher info...</p>;
  }
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Reverse the order of the lectures array
  const reversedLectures = [...lectures].reverse();
  
  return (

    <div className="teacher-dashboard">
      <h2>{teacherInfo.full_name}'s Dashboard</h2>
      <div className="select-container">
        <label htmlFor="classSelect">Select Class:</label>
        <select id="classSelect" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          <option value="">Select a Class</option>
          {classes.map(cls => (
            <option key={cls.class_id} value={cls.class_id}>{cls.class_name}</option>
          ))}
        </select>
      </div>
      {selectedClass && (
        <div className = "select-container">
          <label htmlFor="subjectSelect">Select Subject:</label>
          <select id="subjectSelect" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
            <option value="">Select a Subject</option>
            {subjects.map(sub => (
              <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>
            ))}
          </select>
        </div>
      )}
      {selectedSubject && (
        <div className='add-lecture'>
          <h3 id='lecture'>Lectures</h3>
          <button onClick={handleAddLecture}>Add New Lecture</button>
          <div className="lecture-info">
            {lectures.map(lecture => (
              <div key={lecture.lecture_id} onClick={() => handleLectureClick(lecture.lecture_id)}>
                <h4>Lecture ID: {lecture.lecture_id}</h4>
                <h4>Date: {formatDate(lecture.lecture_date)}</h4>
                <p>Details: {lecture.lecture_details}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div> 
  );
};

export default TeacherDashboard;