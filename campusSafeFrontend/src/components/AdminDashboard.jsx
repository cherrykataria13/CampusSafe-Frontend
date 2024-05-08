import { useEffect, useState } from "react";
import ClassCard from './ClassCard';
import StudentCard from './StudentCard';

const AdminDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rerender, setRerender] = useState(1);
  
  const reRenderNow = ()=>{
    setTimeout(() => {
    setRerender(rerender + 1);
  }, 500); // Set a delay of 500ms
  };
  
  
  useEffect(()=>{
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
  }, [rerender]
  );

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  
  return (
    <div className="dashboard-container">
    <div className="classes-container">
      {classes.map(classInfo => (
        <ClassCard key={classInfo.class_id} classInfo={classInfo} onClick={setSelectedClassId} />
      ))}
    </div>
    {selectedClassId && (
      <div className="students-container">
        <h3>students</h3>
        {students.map(student => (
          <StudentCard key={student.student_id} student={student} />
        ))}
      </div>
    )}
  </div>
  )
}

export default AdminDashboard;