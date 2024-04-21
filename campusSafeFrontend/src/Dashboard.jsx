import { useState, useEffect } from 'react'; 
import './dashboard.css';
import Topbar from './Topbar';
import Modal from './components/Modal';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rerender, setRerender] = useState(1);

  const reRenderNow = ()=>{
    setTimeout(() => {
    setRerender(rerender + 1);
  }, 500); // Set a delay of 500ms
  };
  useEffect(() => {
    fetch('http://localhost:3000/dashboard/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [rerender]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleSliderChange = (subjectId, newProgress) => {
    // Update progress in the backend
    fetch('http://localhost:3000/dashboard/update-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ subjectId, newProgress }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // Log the response from the server
      // Update the subjects state with the new data from the server
      setSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject.subject_id === subjectId ? { ...subject, user_progress: newProgress } : subject
        )
      );
    })
    .catch((error) => console.error(error));
  };

  const handleRemoveResource = (subjectId, resourceIndex) => {
    // Call the API to remove the resource
    fetch('http://localhost:3000/dashboard/remove-resource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ subjectId, resourceIndex }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to remove resource');
        }
        // If successful, update the state or trigger a re-render as needed
        // For example, you can fetch updated data from the server
        reRenderNow();
      })
      .catch((error) => {
        console.error(error);
        // Handle the error, e.g., display an error message to the user
      });
  };

  const handleRemoveSubject = (subjectId) => {
    // Call the API to remove the subject
    fetch('http://localhost:3000/dashboard/remove-subject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ subjectId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to remove subject');
        }
        // If successful, update the state or trigger a re-render as needed
        // For example, you can fetch updated data from the server
        reRenderNow();
      })
      .catch((error) => {
        console.error(error);
        // Handle the error, e.g., display an error message to the user
      });
  };

  return (
    <div className="dashboard-container">
      <Topbar />
      <div className="dashboard-content">
        <h1 className="dashboard-heading">Dashboard</h1>
        <div className="subjects-list">
          <table>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Progress</th>
                <th>Resources</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.subject_id}>
                  <td>{subject.subject_name}</td>
                  <td>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={subject.user_progress}
                      onChange={(e) => handleSliderChange(subject.subject_id, e.target.value)}
                    />
                    {subject.user_progress}%
                  </td>
                  <td>
                    {subject.resource_urls.map((resource, index) => (
                      <div key={index} className="resource-item">
                        {resource}
                        <button className="remove-resource-btn" onClick={() => handleRemoveResource(subject.subject_id, index)}>
                          -
                        </button>
                      </div>
                    ))}
                    <div className='add-resource'>
                      <Modal modalName="+" buttonName="add-resource-btn" data="addResource" rerender={reRenderNow} arg={subject.subject_id} />
                    </div>
                  </td>
                  <td>
                    <button onClick={() => handleRemoveSubject(subject.subject_id)}>
                      Remove Subject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='add-subject'>
          <Modal modalName="Add Subject" data="addSubject" rerender={reRenderNow} />
        </div>
      </div>
    </div>
  );
  
};

export default Dashboard;
