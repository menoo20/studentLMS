
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Home from './pages/Home';
import Students from './pages/Students';
import Schedule from './pages/Schedule';
import Syllabus from './pages/Syllabus';
import Resources from './pages/Resources';

// Component to handle development redirects
const DevRedirect = () => {
  const location = useLocation();
  const newPath = location.pathname.replace('/studentLMS', '') || '/';
  const search = location.search;
  return <Navigate to={newPath + search} replace />;
};

// Main app content that requires authentication
const AppContent = () => {
  const { isAuthenticated, initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/syllabus/jolly-phonics" element={<Syllabus />} />
        <Route path="/syllabus/nesma-english" element={<Syllabus />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
