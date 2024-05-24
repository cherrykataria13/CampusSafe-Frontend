import { useEffect, useState } from "react";

const StudentDashboard = ({userId}) => {
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
    fetch(`http://localhost:8080/dashboard/studentsData/${userId}`, {
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
      <h2>{studentData.name}'s Dashboard</h2>
      <h3>Last 5 Health Stats</h3>
      <ul>
        {studentData.healthStats.map((healthStat, index) => (
          <li key={index}>
            Temperature : {healthStat.temp}, Heart Rate: {healthStat.heart_rate}, Location : {healthStat.loc}, time : {healthStat.timestamp}
          </li>
        ))}
      </ul>
      <h3>Subjects Enrolled</h3>
      <p>Class Name : {studentData.className}</p>
      <ul>
        {studentData.classInfo.map(subject => (
          <li key={subject.subject_id}>subject Name : {subject.subject_name}  Teacher Name : {subject.teacher_name}</li>
        ))}
      </ul>
    </div>
  )
}

export default StudentDashboard;