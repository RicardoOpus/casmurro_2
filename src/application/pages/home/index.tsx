import { useEffect } from 'react';
import startChecks from '../../../service/startChecks';
import casmurroLogo from '/casmurro_logo.svg'
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const checkProjects = async () => {
      const startVerify = new startChecks();
      
      if (!(await startVerify.hasProjects())) { navigate('/projects') }
    };
    checkProjects()
  }, [navigate])

  return (
    <div>
      <div>
        <img src={casmurroLogo} className="logo" alt="Casmurro logo" />
      </div>
      <p>Casmurro com Vite + React</p>
      <button onClick={() => navigate('/dev')}>
          DEV area
      </button>
    </div>
  )
}

export default Home;
