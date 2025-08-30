
import { ThemeProvider } from './components/ThemeContext';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Students from './pages/Students';
import Schedule from './pages/Schedule';
import Syllabus from './pages/Syllabus';
import Resources from './pages/Resources';

// Component to handle development redirects
const DevRedirect = () => {
  const location = useLocation();
  const newPath = location.pathname.replace('/my-annual-plan', '') || '/';
  const search = location.search;
  return <Navigate to={newPath + search} replace />;
};

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/syllabus/jolly-phonics" element={<Syllabus />} />
          <Route path="/syllabus/nesma-english" element={<Syllabus />} />
          <Route path="/resources" element={<Resources />} />
          
          {/* Development redirects - handle manual typing of /my-annual-plan/ */}
          {!import.meta.env.PROD && (
            <>
              <Route path="/my-annual-plan" element={<Navigate to="/" replace />} />
              <Route path="/my-annual-plan/*" element={<DevRedirect />} />
            </>
          )}
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App
