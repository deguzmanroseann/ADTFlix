import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    contactNo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [status, setStatus] = useState('idle');
  
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setIsShowPassword(prev => !prev);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setIsFieldsDirty(true);
  };

  const handleRegister = async () => {
    setStatus('loading');
    try {
      const response = await axios.post('/admin/register', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(response.data);
      alert('Registration successful! Please login.');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setStatus('idle');
    }
  };

  const validateForm = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.middleName &&
      formData.contactNo &&
      formData.email &&
      formData.password &&
      formData.password === formData.confirmPassword
    );
  };

  return (
    <div className="Register">
      <div className="main-container">
        <h3>Register</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-container">
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Contact Number"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type={isShowPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type={isShowPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {formData.password !== formData.confirmPassword && isFieldsDirty && (
              <span className="errors">Passwords do not match</span>
            )}
            <div className="show-password" onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>
            <div className="submit-container">
              <button
                type="button"
                disabled={status === 'loading' || !validateForm()}
                onClick={handleRegister}
              >
                {status === 'idle' ? 'Register' : 'Loading...'}
              </button>
            </div>
            <div className="login-container">
              {/* <a href="/login">Already have an account? Login</a> */}
              <a href="/">
              <small>Already have an account? Login</small></a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, name, type = "text", value, onChange, required }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}:</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default Register;