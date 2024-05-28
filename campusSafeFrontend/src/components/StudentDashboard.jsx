import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import './studentDashboard.css'; 

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
  const chartRef = useRef(null);
  const backend_url= import.meta.env.VITE_BACKEND_URL;
  
  const reRenderNow = ()=>{
    setTimeout(() => {
    setRerender(rerender + 1);
  }, 500); // Set a delay of 500ms
  };
  
  
  useEffect(()=>{
    fetch(`${backend_url}:8080/dashboard/studentsData/${userId}`, {
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
          const response = await fetch(`${backend_url}:8080/dashboard/${userId}/subjects`, {
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
        const response = await fetch(`${backend_url}:8080/dashboard/health-stats/${studentData.studentId}?duration=${duration}`, {
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

const plotHealthStatsGraphs = () => {
  const tempCanvas = document.getElementById('tempChart');
  const heartRateCanvas = document.getElementById('heartRateChart');
  if (tempCanvas && heartRateCanvas) {
    const tempCtx = tempCanvas.getContext('2d');
    const heartRateCtx = heartRateCanvas.getContext('2d');
    const timestamps = healthStats.map(stat => new Date(stat.timestamp).toLocaleDateString());
    const temps = healthStats.map(stat => stat.temp);
    const heartRates = healthStats.map(stat => stat.heart_rate);

    if (tempChartRef.current) {
      tempChartRef.current.destroy(); // Destroy the old chart instance
    }
    if (heartRateChartRef.current) {
      heartRateChartRef.current.destroy(); // Destroy the old chart instance
    }

    tempChartRef.current = new Chart(tempCtx, {
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
          }
        ]
      },
    });

    heartRateChartRef.current = new Chart(heartRateCtx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            label: 'Heart Rate',
            data: heartRates,
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }
        ]
      },
    });
  }
};
  const plotHealthStatsGraph = () => {
    const canvas = document.getElementById('healthStatsChart');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const timestamps = healthStats.map(stat => new Date(stat.timestamp).toLocaleDateString());
        const temps = healthStats.map(stat => stat.temp);
        const heartRates = healthStats.map(stat => stat.heart_rate);

        if (chartRef.current) {
          chartRef.current.destroy(); // Destroy the old chart instance
        }

        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: timestamps,
            datasets: [
              {
                label: 'Temperature',
                data: temps,
                fill: false,
                borderColor: '#b18890',
                tension: 0.1
              },
              {
                label: 'Heart Rate',
                data: heartRates,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
              }
            ]
          },
        });
      }
    }
  };
    
  useEffect(() => {
    if (healthStats.length > 0) {
      plotHealthStatsGraph();
    }
  }, [healthStats]);

  // Handle duration change
  const handleDurationChange = (event) => {
    setDuration(event.target.value);
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

  const handleViewAttendance = (subjectId) => {
    navigate(`/attendance/${studentData.studentId}/${subjectId}`);
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
      <h3>Health Stats</h3>
      <canvas id="healthStatsChart"></canvas>
      <div className="duration-options">
        <label>
          <input
            type="radio"
            value="all"
            checked={duration === "all"}
            onChange={handleDurationChange}
          />
          All Time
        </label>
        <label>
          <input
            type="radio"
            value="1day"
            checked={duration === "1day"}
            onChange={handleDurationChange}
          />
          1 Day
        </label>
        <label>
          <input
            type="radio"
            value="1week"
            checked={duration === "1week"}
            onChange={handleDurationChange}
          />
          1 Week
        </label>
        <label>
          <input
            type="radio"
            value="2weeks"
            checked={duration === "2weeks"}
            onChange={handleDurationChange}
          />
          2 Weeks
        </label>
        <label>
          <input
            type="radio"
            value="1month"
            checked={duration === "1month"}
            onChange={handleDurationChange}
          />
          1 Month
        </label>
      </div>
      <table class = "table1">
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
      <table class = "table2">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Teacher Name</th>
            <th>Attended Lectures</th>
            <th>Total Lectures</th>
          </tr>
        </thead>
        <tbody>
          {classInfo.map((subject) => (
            <tr key={subject.subject_id} onClick={() => handleViewAttendance(subject.subject_id, subject.subject_name)}>
              <td>{subject.subject_name}</td>
              <td>{subject.teacher_name}</td>
              <td>{subject.attended_lectures}</td>
              <td>{subject.total_lectures}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <h3>View Attendance</h3>
      <select value={selectedSubject} onChange={handleSubjectChange}>
        <option value="">Select a Subject</option>
        {studentData.classInfo.map((subject) => (
          <option key={subject.subject_id} value={subject.subject_id}>
            {subject.subject_name}
          </option>
        ))}
      </select>
      <button onClick={handleViewAttendance}>View Attendance</button> */}
    </div>
  );
}

export default StudentDashboard;