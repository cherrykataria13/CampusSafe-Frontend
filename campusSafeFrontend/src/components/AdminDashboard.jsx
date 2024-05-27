import { useEffect, useState } from "react";
import ClassCard from './ClassCard';
import StudentCard from './StudentCard';
import SubjectCard from './SubjectCard'; // Assuming you have a SubjectCard component
import './adminDashboard.css';

const AdminDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rerender, setRerender] = useState(1);
  const [searchClass, setSearchClass] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [searchStudent, setSearchStudent] = useState("");

  const reRenderNow = () => {
    setTimeout(() => {
      setRerender(rerender + 1);
    }, 500); // Set a delay of 500ms
  };

  useEffect(() => {
    fetch('http://localhost:8080/dashboard/getClasses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setClasses(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [rerender]);

  useEffect(() => {
    fetch('http://localhost:8080/dashboard/getSubjects', { // Assuming there's an endpoint to get subjects
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [rerender]);

  useEffect(() => {
    if (selectedClassId) {
      // Fetch students for the selected class
      fetch(`http://localhost:8080/dashboard/${selectedClassId}/getStudents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setStudents(data.data))
        .catch(error => console.error('Error fetching students:', error));
    } else {
      setStudents([]); // Clear students when no class is selected
    }
  }, [selectedClassId]);

  const handleClassSearch = (e) => {
    setSearchClass(e.target.value);
  };

  const handleSubjectSearch = (e) => {
    setSearchSubject(e.target.value);
  };

  const handleStudentSearch = (e) => {
    setSearchStudent(e.target.value);
  };

  const filteredClasses = classes.filter(classInfo =>
    classInfo.class_name.toLowerCase().includes(searchClass.toLowerCase())
  );

  const filteredSubjects = subjects.filter(subject =>
    subject.subject_name.toLowerCase().includes(searchSubject.toLowerCase())
  );

  const filteredStudents = students.filter(student =>
    student.student_name.toLowerCase().includes(searchStudent.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div id="dashboard-container">
      <div className="search-bar">
        <h3>Classes</h3>
        <input
          type="text"
          placeholder="Search for classes..."
          value={searchClass}
          onChange={handleClassSearch}
        />
        <button onClick={() => setSearchClass('')}>Dropdown</button>
        <div className="dropdown-content">
          {filteredClasses.map(classInfo => (
            <ClassCard key={classInfo.class_id} classInfo={classInfo} onClick={setSelectedClassId} />
          ))}
        </div>
      </div>
      <div className="search-bar">
        <h3>Subjects</h3>
        <input
          type="text"
          placeholder="Search for subjects..."
          value={searchSubject}
          onChange={handleSubjectSearch}
        />
        <button onClick={() => setSearchSubject('')}>Dropdown</button>
        <div className="dropdown-content">
          {filteredSubjects.map(subject => (
            <SubjectCard key={subject.subject_id} subject={subject} />
          ))}
        </div>
      </div>
      <div className="search-bar">
        <h3>Students</h3>
        <input
          type="text"
          placeholder="Search for students..."
          value={searchStudent}
          onChange={handleStudentSearch}
        />
        <button onClick={() => setSearchStudent('')}>Dropdown</button>
        <div className="dropdown-content">
          {filteredStudents.map(student => (
            <StudentCard key={student.student_id} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
