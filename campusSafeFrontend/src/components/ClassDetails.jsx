import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubjectCard1 from './SubjectCard1';
import './classDetails.css';

const ClassDetails = () => {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjectsAndStudents = async () => {
      try {
        const subjectsResponse = await fetch(`http://localhost:8080/dashboard/${classId}/getSubjects`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const subjectsData = await subjectsResponse.json();

        const studentsResponse = await fetch(`http://localhost:8080/dashboard/${classId}/getStudents`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const studentsData = await studentsResponse.json();

        setSubjects(subjectsData.data);
        setStudents(studentsData.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchSubjectsAndStudents();
  }, [classId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div id="class-details-container">
      <div id="subjects-container">
        <h3>Subjects</h3>
        {subjects.map(subject => (
          <SubjectCard1 key={subject.subject_id} subject={subject} />
        ))}
      </div>
      <div id="students-container">
        <h3>Students</h3>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.full_name}</td>
                <td>{new Date(student.date_of_birth).toLocaleDateString()}</td>
                <td>{student.gender}</td>
                <td>
                  {/* Add any actions for each student here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassDetails;