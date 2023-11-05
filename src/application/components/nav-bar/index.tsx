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
      <div className="separator" />
      <button
        onClick={() => handleButtonClick('/characters', 'Personagens')}
        id="Personagens"
        className={`navBarItem ${activeButton === 'Personagens' ? 'NavBarActive' : ''}`}
        type="button"
      >
        Personagens
      </button>
      <div className="separator" />
      <button id="Mundo" className="navBarItem" type="button">Mundo</button>
      <div className="separator" />
      <button id="Rascunho" className="navBarItem" type="button">Rascunho</button>
      <div className="separator" />
      <button id="Timeline" className="navBarItem" type="button">Timeline</button>
      <div className="separator" />
      <button id="Notas" className="navBarItem" type="button">Notas</button>
      <div className="separator" />
      <button id="Sobre" className="navBarItem navBatItemEnd" type="button">Sobre</button>
    </div>
  );
}

export default NavBar;
