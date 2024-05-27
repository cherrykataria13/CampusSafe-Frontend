import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './attendance.css';

const LectureDetail = () => {
  const { classId, subjectId, lectureId } = useParams();
  const [lectureData, setLectureData] = useState(null);
  const backend_url= process.env.backend_url;

  useEffect(() => {
    fetch(`${backend_url}:8080/teacher/classes/${classId}/subjects/${subjectId}/lectures/${lectureId}/attendance`)
      .then(response => response.json())
      .then(data => setLectureData(data.data))
      .catch(error => console.error('Error fetching lecture data', error));
  }, [classId, subjectId, lectureId]);

  if (!lectureData) {
    return <p>Loading lecture data...</p>;
  }

  const teacherName = lectureData.length > 0 ? lectureData[0].teacher_name : 'N/A';
  const lectureDescription = lectureData.length > 0 ? lectureData[0].lecture_details : 'N/A';

  return (
    <div className='lecture-attendance'>
      <h2>Lecture Details</h2>
      <p>Teacher Name: {teacherName}</p>
      <p>Lecture Description: {lectureDescription}</p>
      <table className='table-attendance'>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Attendance Status</th>
          </tr>
        </thead>
        <tbody>
          {lectureData.map(record => (
            <tr key={record.student_name} className={`attendance-${record.attendance_status}`}>
              <td>{record.student_id}</td>
              <td>{record.student_name}</td>
              <td>{record.attendance_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LectureDetail;
