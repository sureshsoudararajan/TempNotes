import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: ''
  });

  const { email, password, password2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      console.log('Passwords do not match');
      dispatch({
        type: 'SIGNUP_FAIL',
        payload: { message: 'Passwords do not match.' }
      });
    } else {
      try {
        const res = await authService.signup(email, password);
        dispatch({
          type: 'SIGNUP_SUCCESS',
          payload: { ...res.data, message: 'Signup successful!' }
        });
        navigate('/');
      } catch (err) {
        const message = err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : err.message;
        dispatch({
          type: 'SIGNUP_FAIL',
          payload: { message }
        });
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          minLength="6"
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          name="password2"
          value={password2}
          onChange={onChange}
          minLength="6"
        />
      </div>
      <input type="submit" value="Register" />
    </form>
  );
};

export default SignupForm;