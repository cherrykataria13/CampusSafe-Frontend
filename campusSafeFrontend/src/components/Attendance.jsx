import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Attendance = () => {
  const { studentId, subjectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/dashboard/${studentId}/subjects/${subjectId}/attendance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAttendanceData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [studentId, subjectId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>Attendance for Subject: {subjectName}</h2>
      <ul>
        {attendanceData.map((record, index) => (
          <li key={index}>
            Date: {record.attendance_date}, Status: {record.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Attendance;
