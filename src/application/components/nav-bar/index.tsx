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
      <button id="Mundo" className="navBarItem" type="button">Mundo</button>
      <button id="Rascunho" className="navBarItem" type="button">Rascunho</button>
      <button id="Timeline" className="navBarItem" type="button">Timeline</button>
      <button id="Notas" className="navBarItem" type="button">Notas</button>
      <div className="nav-right">
        <button
          onClick={() => handleButtonClick('/', 'settings')}
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
