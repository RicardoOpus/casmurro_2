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
      <button id="Timeline" className="navBarItem" type="button">Timeline</button>
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
          onClick={() => handleButtonClick('/settings', 'settings')}
          type="button"
          className="settingsIcon"
        >
          { }
        </button>
        <button id="Sobre" className="navBarItem " type="button">Sobre</button>
      </div>
    </div>
  );
}

export default NavBar;
