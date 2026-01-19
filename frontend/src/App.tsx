import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import AIInterview from './pages/AIInterview';
import Profile from './pages/Profile';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Problem Set (List View) */}
        <Route 
          path="/problems" 
          element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          } 
        />

        {/* Single Problem (Detail View) */}
        <Route 
          path="/problems/:id" 
          element={
            <ProtectedRoute>
              <ProblemDetail />
            </ProtectedRoute>
          } 
        />

        {/* AI Interview (Placeholder) */}
        <Route 
          path="/interview" 
          element={
            <ProtectedRoute>
              <AIInterview />
            </ProtectedRoute>
          } 
        />

        {/* Profile (Placeholder) */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;