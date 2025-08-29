
import { ThemeProvider } from './components/ThemeContext';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Students from './pages/Students';
import Schedule from './pages/Schedule';
import Syllabus from './pages/Syllabus';
import Resources from './pages/Resources';


function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App
