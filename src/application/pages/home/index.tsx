import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StartChecks from '../../../service/startChecks';

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const checkProjects = async () => {
      const startVerify = new StartChecks();
      if (!(await startVerify.hasProjects())) { navigate('/projects'); }
    };
    checkProjects();
  }, [navigate]);

  return (
    <div>
      <p>Casmurro com Vite + React</p>
      <button type="button" onClick={() => navigate('/dev')}>
        DEV area
      </button>
    </div>
  );
}

export default Home;
