function StudentCard({ student }) {
    return (
      <div className="student-card">
        <h4>{student.full_name}</h4>
        <p>Date of Birth: {student.date_of_birth}</p>
        <p>Gender: {student.gender}</p>
      </div>
    );
  }
  
  export default StudentCard;