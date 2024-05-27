import React from 'react';
import './subjectCard.css'; // Ensure you have corresponding CSS for styling

const SubjectCard1 = ({ subject }) => {
  return (
    <div className="subject-card">
      <h4>{subject.subject_name}</h4>
      <p>Subject ID: {subject.subject_id}</p>
      <p>no of Lectures: {subject.num_lectures}</p>
    </div>
  );
};

export default SubjectCard1;