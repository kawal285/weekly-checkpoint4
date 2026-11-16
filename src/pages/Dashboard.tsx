
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import '../App.css';

interface Student {
  name: string;
  email: string;
  contact: string;
  gender: string;
}

function Dashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Retrieve logged-in student's profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/students/profile');

        setStudent(response.data.student);

      } catch (error: unknown) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          sessionStorage.removeItem('token');
          navigate('/login', { replace: true });
          return;
        }

        setError('Unable to load student information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  if (loading) {
    return <div className="dashboard-container">
      <p>Loading student information...</p>
    </div>;
  }

  if (error) {
    return <div className="dashboard-container">
      <p className="form-error">{error}</p>
      <button onClick={handleLogout}>Back to Login</button>
    </div>;
  }

  return (
    <div className="dashboard-container">

      <h1>Student Dashboard</h1>

      <p>Welcome to the School Students Registration System!</p>

      <div className="dashboard-card">

        <h2>Welcome, {student?.name}!</h2>

        <p><strong>Email:</strong> {student?.email}</p>

        <p><strong>Contact:</strong> {student?.contact}</p>

        <p><strong>Gender:</strong> {student?.gender}</p>

        <p>You have successfully logged in to your student account.</p>

      </div>

      <button onClick={handleLogout} className="logout-link">
        Logout
      </button>

    </div>
  );
}

export default Dashboard;
