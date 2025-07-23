import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const signup = (email, password) => {
  return axios.post(`${API_URL}/signup`, {
    email,
    password
  });
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password
  });
};

const verify = (token) => {
  return axios.get(`${API_URL}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const authService = {
  signup,
  login,
  verify
};

export default authService;
