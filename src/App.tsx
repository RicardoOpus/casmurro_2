import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './application/pages/home';
import Dev from './application/pages/dev';
import Layout from './application/components/layout';
import NotFound from './application/pages/not-found';
import Projects from './application/pages/projects';
import Splash from './application/pages/splash';
import Charaters from './application/pages/characters';

function App() {
  const [showSplash, setShowSplash] = useState(true);
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

  return (
    <div>
      {showSplash ? (
        <Splash />
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Home />} />
            <Route path="/characters" element={<Charaters />} />
            <Route path="/dev" element={<Dev />} />
          </Route>
          <Route path="/splash" element={<Splash />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
