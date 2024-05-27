// AddLecture.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import './addLecture.css';

const AddLecture = () => {
    const { classId, subjectId } = useParams();
    const [lectureDate, setLectureDate] = useState('');
    const [wifiLocations, setWifiLocations] = useState([]);
    const [selectedwifi, setSelectedwifi] = useState(null);
    const [lectureDetails, setLectureDetails] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/teacher/wifi', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setWifiLocations(data.wifiNetworks);
        })
        .catch(error => {
            console.error('Error fetching Wi-Fi locations:', error);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newLecture = {
            class_id:classId,
            subject_id:subjectId,
            lecture_date: lectureDate,
            wifi_id: selectedwifi,
            lecture_details: lectureDetails,
        };

        fetch('http://localhost:8080/teacher/addLecture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(newLecture),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                window.alert("lecture added succesfully");
                navigate('/Dashboard');
            } else {
                console.error('Error adding lecture:', data.error);
            }
        })
        .catch(error => {
            console.error('Error adding lecture:', error);
        });
    };

    return (
        <div className="container">
            <div className="box">
                <h2>Add New Lecture</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Lecture Date:</label>
                        <input 
                            type="date" 
                            value={lectureDate} 
                            onChange={(e) => setLectureDate(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Wi-Fi Location:</label>
                        <select 
                            value={selectedwifi} 
                            onChange={(e) => setSelectedwifi(e.target.value)} 
                            required
                        >
                            <option value="">Select a location</option>
                            {wifiLocations.map((location) => (
                                <option key={location.wifi_id} value={location.wifi_id}>
                                    {location.location}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Lecture Details:</label>
                        <textarea 
                            value={lectureDetails} 
                            onChange={(e) => setLectureDetails(e.target.value)} 
                        />
                    </div>
                    <button type="submit" id='lecture-button'>Add Lecture</button>
                </form>
            </div>
        </div>
    );
};

export default AddLecture;