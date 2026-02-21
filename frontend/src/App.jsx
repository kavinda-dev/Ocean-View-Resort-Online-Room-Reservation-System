import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login          from './pages/Login';
import Dashboard      from './pages/Dashboard';
import AddReservation from './pages/AddReservation';
import ViewReservation from './pages/ViewReservation';
import Invoice        from './pages/Invoice';
import Reports        from './pages/Reports';
import Help           from './pages/Help';
import Navbar         from './components/Navbar';

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('ovr_user')) || null
  );

  const handleLogin = (userData) => {
    localStorage.setItem('ovr_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('ovr_user');
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard user={user} /></ProtectedRoute>
        } />
        <Route path="/reservations/add" element={
          <ProtectedRoute><AddReservation /></ProtectedRoute>
        } />
        <Route path="/reservations/view" element={
          <ProtectedRoute><ViewReservation /></ProtectedRoute>
        } />
        <Route path="/invoice/:id" element={
          <ProtectedRoute><Invoice /></ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute><Reports /></ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute><Help /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
