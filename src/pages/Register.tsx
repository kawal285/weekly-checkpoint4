
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import '../App.css';

function Register() {
  // Store student registration details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle changes in form fields
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle registration form submission
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage('');

    if (formData.password.length < 8) {
      setIsError(true);
      setMessage('Password must be at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match!');
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post('/auth/register', formData);

      setIsError(false);
      setMessage(response.data.message);

      // Clear the form after successful registration
      setFormData({
        name: '',
        email: '',
        contact: '',
        gender: '',
        password: '',
        confirmPassword: ''
      });

    } catch (error: unknown) {
      setIsError(true);

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ||
          'Registration failed. Please try again.'
        );
      } else {
        setMessage('An unexpected error occurred.');
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">

      <h1>Student Registration</h1>
      <p>Create your student account</p>

      <form onSubmit={handleSubmit}>

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Contact Number</label>
        <input
          type="tel"
          name="contact"
          placeholder="Enter your contact number"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {message && (
          <p
            className={isError ? 'error-message' : 'success-message'}
            role={isError ? 'alert' : 'status'}
          >
            {message}
          </p>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>

      </form>

      <p className="register-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>

    </div>
  );
}

export default Register;
