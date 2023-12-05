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
import World from './application/pages/world';
import WorldDetail from './application/pages/world/world-detail';
import Notes from './application/pages/notes';
import NotesDetail from './application/pages/notes/notes-detail';
import Manuscript from './application/pages/manuscript';
import Trash from './application/pages/trash';

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
            <Route path="/world" element={<World />} />
            <Route path="/world/:id" element={<WorldDetail />} />
            <Route path="/manuscript" element={<Manuscript />} />
            <Route path="/manuscript/:id" element={<Manuscript />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/:id" element={<NotesDetail />} />
            <Route path="/trash" element={<Trash />} />
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
