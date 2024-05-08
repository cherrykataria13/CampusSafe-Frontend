function ClassCard({ classInfo, onClick }) {
    return (
      <div className="class-card" onClick={() => onClick(classInfo.class_id)}>
        <h3>{classInfo.class_name}</h3>
        <p>Students Enrolled: {classInfo.num_students}</p>
      </div>
    );
  }
  
  export default ClassCard;