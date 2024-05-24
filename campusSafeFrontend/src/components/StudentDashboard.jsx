import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

const StudentDashboard = ({userId}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rerender, setRerender] = useState(1);
  const [studentData, setStudentData] = useState(null);
  const [classInfo, setClassInfo] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectName, setSelectedSubjectName] = useState('');
  const [healthStats, setHealthStats] = useState([]);
  const [duration, setDuration] = useState('all'); // State for selected duration
  const navigate = useNavigate();
  
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
    
      const fetchClassInfo = async () => {
        try {
          const response = await fetch(`http://localhost:8080/dashboard/${userId}/subjects`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          const data = await response.json();
          setClassInfo(data.data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
    fetchClassInfo();
  }, [rerender]
  );

  useEffect(() => {
    const fetchHealthStats = async () => {
      try {
        const response = await fetch(`http://localhost:8080/dashboard/health-stats/${userId}?duration=${duration}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data = await response.json();
        setHealthStats(data.healthStats);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    if(!loading)
      {
        fetchHealthStats();
      }
  }, [userId, duration, loading]);


// Function to plot the health stats graph
  const plotHealthStatsGraph = () => {
    const ctx = document.getElementById('healthStatsChart');
    const timestamps = healthStats.map(stat => new Date(stat.timestamp).toLocaleDateString());
    const temps = healthStats.map(stat => stat.temp);
    const heartRates = healthStats.map(stat => stat.heart_rate);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
          label: 'Temperature',
          data: temps,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Heart Rate',
          data: heartRates,
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }]
      },
    });
  };

  useEffect(() => {
    if (healthStats.length > 0) {
      plotHealthStatsGraph();
    }
  }, [healthStats]);

  // Handle duration change
  const handleDurationChange = (selectedDuration) => {
    setDuration(selectedDuration);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    const selectedSubject = studentData.classInfo.find(subject => subject.subject_id === selectedSubjectId);
    setSelectedSubject(selectedSubjectId);
    setSelectedSubjectName(selectedSubject.subject_name);
  };

  const handleViewAttendance = () => {
    if (selectedSubject) {
      navigate(`/attendance/${userId}/${selectedSubject}/${selectedSubjectName}`);
    }
  };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const formatDateTime = (dateTime) => {
    const options = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTime));
  };

  return (
    <div>
      <h2>{studentData.name}</h2>
      <h3>Last 5 Health Stats</h3>
      <div className="duration-options">
        <div className={`duration-option ${duration === 'all' ? 'active' : ''}`} onClick={() => handleDurationChange('all')}>
          All Time
        </div>
        <div className={`duration-option ${duration === '1day' ? 'active' : ''}`} onClick={() => handleDurationChange('1day')}>
          1 Day
        </div>
        <div className={`duration-option ${duration === '1week' ? 'active' : ''}`} onClick={() => handleDurationChange('1week')}>
          1 Week
        </div>
        <div className={`duration-option ${duration === '2weeks' ? 'active' : ''}`} onClick={() => handleDurationChange('2weeks')}>
          2 Weeks
        </div>
        <div className={`duration-option ${duration === '1month' ? 'active' : ''}`} onClick={() => handleDurationChange('1month')}>
          1 Month
        </div>
        
        <canvas id="healthStatsChart"></canvas>
      </div>
      <table>
        <thead>
          <tr>
            <th>Temperature</th>
            <th>Heart Rate</th>
            <th>Location</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {studentData.healthStats.map((healthStat, index) => (
            <tr key={index}>
              <td>{healthStat.temp}</td>
              <td>{healthStat.heart_rate}</td>
              <td>{healthStat.loc}</td>
              <td>{formatDateTime(healthStat.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Subjects Enrolled</h3>
      <p>Class Name : {studentData.className}</p>
      <table>
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Teacher Name</th>
            <th>Attended Lectures</th>
            <th>Total Lectures</th>
          </tr>
        </thead>
        <tbody>
          {classInfo.map(subject => (
            <tr key={subject.subject_id}>
              <td>{subject.subject_name}</td>
              <td>{subject.teacher_name}</td>
              <td>{subject.attended_lectures}</td>
              <td>{subject.total_lectures}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>View Attendance</h3>
      <select value={selectedSubject} onChange={handleSubjectChange}>
        <option value="">Select a Subject</option>
        {studentData.classInfo.map(subject => (
          <option key={subject.subject_id} value={subject.subject_id}>{subject.subject_name}</option>
        ))}
      </select>
      <button onClick={handleViewAttendance}>View Attendance</button>
    </div>   
  )
}

export default StudentDashboard;