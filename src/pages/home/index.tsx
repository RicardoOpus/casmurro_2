import casmurroLogo from '/casmurro_logo.svg'
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <img src={casmurroLogo} className="logo" alt="Vite logo" />
      </div>
      <p>Casmurro com Vite + React</p>
      <button onClick={() => navigate('/dev')}>
          DEV area
      </button>
    </div>
  )
}

export default Home;
