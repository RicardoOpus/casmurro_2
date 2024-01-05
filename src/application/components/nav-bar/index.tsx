import { useLocation, useNavigate } from 'react-router-dom';
import './nav-bar.css';
import { useEffect, useState } from 'react';

function NavBar() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('Dashboard');
  const location = useLocation();

  useEffect(() => {
    setActiveButton(location.pathname.split('/')[1]);
  }, [location.pathname]);

  return (
    <div className="navBar">
      <button
        onClick={() => navigate('/')}
        id="Dashboard"
        className={`navBarItem ${activeButton === '' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Dashboard
      </button>
      <button
        onClick={() => navigate('/characters')}
        id="Personagens"
        className={`navBarItem ${activeButton === 'characters' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Personagens
      </button>
      <button
        onClick={() => navigate('/world')}
        id="Mundo"
        className={`navBarItem ${activeButton === 'world' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Mundo
      </button>
      <button
        onClick={() => navigate('/notes')}
        id="Notas"
        className={`navBarItem ${activeButton === 'notes' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Notas
      </button>
      <button
        onClick={() => navigate('/timeline')}
        id="Timeline"
        className={`navBarItem ${activeButton === 'timeline' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Timeline
      </button>
      <button
        onClick={() => navigate('/manuscript')}
        id="Manuscrito"
        className={`navBarItem ${activeButton === 'manuscript' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Manuscrito
      </button>
      <div className="nav-right">
        <button
          id="Settings"
          onClick={() => navigate('/trash')}
          type="button"
          className={`${activeButton === 'trash' ? 'trashIconActive' : 'trashIcon'}`}
        >
          { }
        </button>
        <button
          id="Settings"
          onClick={() => navigate('/settings')}
          type="button"
          className={`${activeButton === 'settings' ? 'settingsIconActive' : 'settingsIcon'}`}
        >
          { }
        </button>
        <button
          onClick={() => navigate('/about')}
          id="Sobre"
          className={`navBarItem ${activeButton === 'about' ? 'NavBarActive' : ''}`}
          type="button"
        >
          Sobre
        </button>
      </div>
    </div>
  );
}

export default NavBar;
