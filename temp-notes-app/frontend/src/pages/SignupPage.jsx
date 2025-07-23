import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../components/SignupForm';

const SignupPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h1>Signup</h1>
        <SignupForm />
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
