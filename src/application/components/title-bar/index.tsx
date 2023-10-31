import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './title-bar.css';

function TitleBar() {
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useState(false);
  
  useEffect(() => {
    const storedMode = localStorage.getItem('uiMode');
    if (storedMode === 'light') {
      setIsLightMode(true);
      document.documentElement.classList.add('light-mode');
    } else {
      setIsLightMode(false);
      document.documentElement.classList.remove('light-mode');
    }
  }, [])

  function toggleLightMode() {
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('uiMode', 'light');
    setIsLightMode(true);
  }

  function toggleDarktMode() {
    console.log('clicou');
    document.documentElement.classList.remove('light-mode');
    localStorage.setItem('uiMode', 'dark');
    setIsLightMode(false);
  }

  return (
    <div id="main-header" className="header">
      <div className="logoTitle">
        <img className="icon-color" src="./casmurro-logo.svg" alt="logo Casmurro" width="170px" />
      </div>
      <div className="separator" />
      <button className="btnPorjects" type="button" onClick={() => navigate('/projects')}>Projetos</button>
      <div className="header-right">
        {isLightMode ? (
          <span onClick={toggleDarktMode} className="uiMode"></span>
        ) : (
          <span onClick={toggleLightMode} className="uiMode"></span>
        )}
        <button className="btnDiscret" type="button">Fazer backup</button>
      </div>
    </div>
  );
}

export default TitleBar;
