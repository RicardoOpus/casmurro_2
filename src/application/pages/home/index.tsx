import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StartChecks from '../../../service/startChecks';
import casmurroLogo from '/casmurro-logo.svg';
import Splash from '../splash';

function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const checkProjects = async () => {
      const startVerify = new StartChecks();
      if (!(await startVerify.hasProjects())) { navigate('/projects'); }
    };
    checkProjects();
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showSplash ? (
        <Splash />
      ) : (
        <div>
          <div>
            <img src={casmurroLogo} className="logo" alt="Casmurro logo" />
          </div>
          <p>Casmurro com Vite + React</p>
          <button type="button" onClick={() => navigate('/dev')}>
            DEV area
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
