import { useEffect, useState } from "react";

const StudentDashboard = ({studentId}) => {
  const [data,setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rerender, setRerender] = useState(1);
  const [studentData, setStudentData] = useState(null);
  
  const reRenderNow = ()=>{
    setTimeout(() => {
    setRerender(rerender + 1);
  }, 500); // Set a delay of 500ms
  };
  
  
  useEffect(()=>{
    fetch(`http://localhost:8080/dashboard/studentsData/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setStudentData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [rerender]
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>{studentData.full_name}'s Dashboard</h2>
      <h3>Last 5 Health Stats</h3>
      <ul>
        {studentData.healthStats.map((healthStat, index) => (
          <li key={index}>
            Height: {healthStat.height}, Weight: {healthStat.weight}, Blood Pressure: {healthStat.blood_pressure}, Heart Rate: {healthStat.heart_rate}
          </li>
        ))}
      </ul>
      <h3>Subjects Enrolled</h3>
      <ul>
        {studentData.subjectsEnrolled.map(subject => (
          <li key={subject.subject_id}>{subject.subject_name}</li>
        ))}
      </ul>
    </div>
  )
}

export default StudentDashboard;