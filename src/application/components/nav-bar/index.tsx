import { useNavigate } from 'react-router-dom';
import './nav-bar.css';
import { useState } from 'react';

function NavBar() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('Dashboard');

  const handleButtonClick = (route: string, buttonId: string) => {
    navigate(route);
    setActiveButton(buttonId);
  };

  return (
    <div className="navBar">
      <button
        onClick={() => handleButtonClick('/', 'Dashboard')}
        id="Dashboard"
        className={`navBarItem ${activeButton === 'Dashboard' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Dashboard
      </button>
      <button
        onClick={() => handleButtonClick('/characters', 'Personagens')}
        id="Personagens"
        className={`navBarItem ${activeButton === 'Personagens' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Personagens
      </button>
      <button
        onClick={() => handleButtonClick('/world', 'Mundo')}
        id="Mundo"
        className={`navBarItem ${activeButton === 'Mundo' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Mundo
      </button>
      <button
        onClick={() => handleButtonClick('/notes', 'Notas')}
        id="Notas"
        className={`navBarItem ${activeButton === 'Notas' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Notas
      </button>
      <button
        onClick={() => handleButtonClick('/timeline', 'Timeline')}
        id="Timeline"
        className={`navBarItem ${activeButton === 'Timeline' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Timeline
      </button>
      <button
        onClick={() => handleButtonClick('/manuscript', 'Manuscrito')}
        id="Manuscrito"
        className={`navBarItem ${activeButton === 'Manuscrito' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Manuscrito
      </button>
      <div className="nav-right">
        <button
          id="Settings"
          onClick={() => handleButtonClick('/trash', 'Trash')}
          type="button"
          className={`${activeButton === 'Trash' ? 'trashIconActive' : 'trashIcon'}`}
        >
          { }
        </button>
        <button
          id="Settings"
          onClick={() => handleButtonClick('/settings', 'Settings')}
          type="button"
          className={`${activeButton === 'Settings' ? 'settingsIconActive' : 'settingsIcon'}`}
        >
          { }
        </button>
        <button id="Sobre" className="navBarItem " type="button">Sobre</button>
      </div>
    </div>
  );
}

export default NavBar;
