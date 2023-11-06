import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './application/pages/home';
import Dev from './application/pages/dev';
import Layout from './application/components/layout';
import NotFound from './application/pages/not-found';
import Projects from './application/pages/projects';
import Splash from './application/pages/splash';
import Characters from './application/pages/characters';
import AppService from './service/startChecks';
import indexedDBrepository from './infra/repository/indexedDBrepository';
import { fetchProjectDataAction, projectDataAction } from './application/redux/actions';

type RootState = {
  projectDataReducer: {
    hasChange: boolean,
  }
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { hasChange } = useSelector((state: RootState) => state.projectDataReducer);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (hasChange) {
      const fetchData = async () => {
        const projectItem = await indexedDBrepository.getCurrentProject();
        if (projectItem) {
          dispatch(projectDataAction(projectItem));
          dispatch(fetchProjectDataAction(false));
        }
      };
      fetchData();
    }
  }, [dispatch, hasChange]);

  return (
    <div>
      {showSplash ? (
        <Splash />
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="/characters" element={<Characters />} />
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
