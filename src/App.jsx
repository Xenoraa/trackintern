import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Layout from './components/common/Layout.jsx';
import { ROLES } from './utils/constants.jsx';

// Auth Pages
import Login from './pages/Auth/Login';
import StudentRegister from './pages/Auth/StudentRegister.jsx';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard.jsx';
import StudentLogbook from './pages/Student/Logbook.jsx';
import SubmitLogbook from './pages/Student/SubmitLogbook.jsx';

// Supervisor Pages
import SupervisorDashboard from './pages/Supervisor/Dashboard.jsx';

// Coordinator Pages
import CoordinatorDashboard from './pages/Coordinator/Dashboard.jsx';
import VerificationCodes from './pages/Coordinator/VerificationCodes.jsx';

// HOD Pages (placeholder)
const HODDashboard = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">HOD Dashboard</h1>
      <p className="text-gray-600 mt-1">Head of Department Interface</p>
    </div>
);

function App() {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/student/register" element={<StudentRegister />} />

            {/* Protected Routes with Layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={
                      <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={
                      <ProtectedRoute allowedRoles={[ROLES.INSTITUTION_SUPERVISOR]}>
                        <SupervisorDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={
                      <ProtectedRoute allowedRoles={[ROLES.COORDINATOR]}>
                        <CoordinatorDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={
                      <ProtectedRoute allowedRoles={[ROLES.HOD]}>
                        <HODDashboard />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/logbook" element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <Layout>
                  <StudentLogbook />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/logbook/submit" element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <Layout>
                  <SubmitLogbook />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Coordinator Routes */}
            <Route path="/verification" element={
              <ProtectedRoute allowedRoles={[ROLES.COORDINATOR]}>
                <Layout>
                  <VerificationCodes />
                </Layout>
              </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Page not found</p>
                  <a href="/" className="btn-primary">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;