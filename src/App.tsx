import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './application/pages/home';
import Layout from './application/components/layout';
import NotFoundPage from './application/pages/not-found';
import Projects from './application/pages/projects';
import Splash from './application/pages/splash';
import Characters from './application/pages/characters';
import AppService from './service/startChecks';
import CharactersDetail from './application/pages/characters/characters-detail';
import Settings from './application/pages/settings';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMode = localStorage.getItem('uiMode');
    if (storedMode === 'light') {
      const root = document.documentElement;
      root.classList.toggle('light-mode');
    } else {
      const root = document.documentElement;
      root.classList.remove('light-mode');
    }
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkProjects = async () => {
      const appService = new AppService();
      const check = await appService.hasProjects();
      if (!check) {
        navigate('/projects');
      }
    };
    checkProjects();
  }, [navigate]);

  return (
    <div>
      {showSplash ? (
        <Splash />
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/characters/:id" element={<CharactersDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/splash" element={<Splash />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
