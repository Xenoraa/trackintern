import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyCode from './pages/Auth/VerifyCode';

// Dashboard Pages
import Dashboard from './pages/Dashboard/Dashboard';
import WeeklyLogbook from './pages/Logbook/WeeklyLogbook';

// Defense Pages
import CoordinatorDefense from './pages/Defense/CoordinatorDefense';
import StudentDefense from './pages/Defense/StudentDefense';

// Other Pages
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/logbook" element={
            <PrivateRoute allowedRoles={['student']}>
              <WeeklyLogbook />
            </PrivateRoute>
          } />

          {/* Defense Routes */}
          <Route path="/defense/coordinator" element={
            <PrivateRoute allowedRoles={['siwesCoordinator', 'hod']}>
              <CoordinatorDefense />
            </PrivateRoute>
          } />

          <Route path="/defense/student" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDefense />
            </PrivateRoute>
          } />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;