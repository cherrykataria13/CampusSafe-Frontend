import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Topbar from "../Topbar";
import './attendance.css';

const Attendance = () => {
  const { studentId, subjectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [subjectName,setSubjectName] = useState(null);
  const backend_url= process.env.backend_url;
  
  useEffect(() => {
    fetch(`${backend_url}:8080/dashboard/${studentId}/subjects/${subjectId}/attendance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAttendanceData(data.data);
        setSubjectName(data.subName);
        console.log(data);
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

  const totalLectures = attendanceData.length;
  const attendedLectures = attendanceData.filter(lecture => lecture.status === 'present').length;
  const attendancePercentage = ((attendedLectures / totalLectures) * 100).toFixed(2);

  return (
    <div>
      <Topbar />
    <div className="lecture-attendance">
      <h2 id="attendance-label">Attendance for Subject: {subjectName}</h2>
      <div className="attendance-percentage">
          <strong>Attendance Percentage: {attendancePercentage}%</strong>
      </div>
      <table className="table-attendance">
      <thead>
        <tr>
          <th>Lecture ID</th>
          <th>Date</th>
          <th>Details</th>
          <th>Location</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {attendanceData.map((lecture) => (
          <tr key={lecture.lecture_id} className={`attendance-${lecture.status}`}>
            <td>{lecture.lecture_id}</td>
            <td>{new Date(lecture.lecture_date).toLocaleDateString()}</td>
            <td>{lecture.lecture_details}</td>
            <td>{lecture.location}</td>
            <td>{lecture.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
  );
};

export default Attendance;
