import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NoteDetailPage from './pages/NoteDetailPage';
import PrivateRoute from './components/PrivateRoute';
import Toast from './components/Toast';
import Header from './components/Header'; // Import Header
import './App.css';

function AppContent() {
  const { message, messageType, clearMessage, isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated && <Header />} {/* Show Header only when authenticated */}
      {message && (
        <div className="toast-container">
          <Toast message={message} type={messageType} onClose={clearMessage} />
        </div>
      )}
      <div className="main-content"> {/* Add a main-content div for padding */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/note/:id" element={<NoteDetailPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
