import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await authService.login(email, password);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { ...res.data, message: 'Login successful!' }
      });
      navigate('/');
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : err.message;
      dispatch({
        type: 'LOGIN_FAIL',
        payload: { message }
      });
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
      <input type="submit" value="Login" />
    </form>
  );
};

export default LoginForm;