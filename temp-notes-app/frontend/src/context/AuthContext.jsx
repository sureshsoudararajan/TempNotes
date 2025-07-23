import React, { createContext, useReducer, useEffect } from 'react';
import authReducer from './authReducer';
import authService from '../services/authService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const initialState = {
    token: sessionStorage.getItem('token'), // Changed to sessionStorage
    isAuthenticated: null,
    loading: true,
    user: null,
    message: null, // For notifications
    messageType: null // For notifications
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await authService.verify(state.token);
        dispatch({
          type: 'USER_LOADED',
          payload: res.data
        });
      } catch (err) {
        dispatch({
          type: 'AUTH_ERROR',
          payload: { message: 'Session expired or invalid.' }
        });
      }
    };

    if (state.token) {
      verifyToken();
    } else {
      dispatch({
        type: 'AUTH_ERROR',
        payload: { message: 'No token found.' }
      });
    }
  }, [state.token]);

  const clearMessage = () => {
    dispatch({ type: 'CLEAR_MESSAGE' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        clearMessage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
