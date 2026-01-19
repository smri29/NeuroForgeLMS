import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProblemDetail from './pages/ProblemDetail';
import { useAuth } from './hooks/useAuth';

// A wrapper to protect routes (Dashboard shouldn't be public)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Route: Real Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemDetail />
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