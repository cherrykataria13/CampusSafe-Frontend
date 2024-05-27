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
        setSubjectName(data.subName);
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
      <Topbar />
      <div className="attendance-table-container">
        <h2 id="attendance-label">Attendance for Subject: {subjectName}</h2>
        <div className="attendance-table-wrapper">
          <table className="attendance-table">
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
                <tr key={lecture.lecture_id}>
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
    </div>
  );
};

export default Attendance;
