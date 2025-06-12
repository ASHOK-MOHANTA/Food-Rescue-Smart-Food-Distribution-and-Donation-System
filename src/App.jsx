import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/Layout/LoadingSpinner';
import PrivateRoute from './components/Layout/PrivateRoute';
import Login from './components/Auth/Login';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DonationsPage from './pages/DonationsPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {user && <Navbar />}
        
        <main className="flex-1">
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LandingPage />
                )
              }
            />
            
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/donations"
              element={
                <PrivateRoute>
                  <DonationsPage />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/map"
              element={
                <PrivateRoute>
                  <MapPage />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;