import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import './title-bar.css';
import Project from '../../../domain/projectModel';
import TitleBarService from '../../../service/titleBarService';

type RootState = {
  projectDataReducer: {
    projectData: Project,
  }
};

function TitleBar() {
  const titleBarService = useMemo(() => new TitleBarService(), []);
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useState(false);
  const { projectData } = useSelector((state: RootState) => state.projectDataReducer);
  const [showBackupWarning, setbackupWarning] = useState('');

  useEffect(() => {
    const storedMode = localStorage.getItem('uiMode');
    if (storedMode === 'light') {
      setIsLightMode(true);
      document.documentElement.classList.add('light-mode');
    } else {
      setIsLightMode(false);
      document.documentElement.classList.remove('light-mode');
    }
  }, []);

  useEffect(() => {
    const mensage = titleBarService.backupMensage(projectData.lastBackup);
    setbackupWarning(mensage);
  }, [projectData.lastBackup, titleBarService]);

  function toggleLightMode() {
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('uiMode', 'light');
    setIsLightMode(true);
  }

  function toggleDarktMode() {
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
      <div className="separator" />
      <p className="projectTitle">{titleBarService.titleReduction(projectData.title || '')}</p>
      <div className="header-right">
        {(showBackupWarning) && (
          <p className="backupWarning">{showBackupWarning}</p>
        )}
        {isLightMode ? (
          <button onClick={toggleDarktMode} type="button" className="uiMode">{ }</button>
        ) : (
          <button onClick={toggleLightMode} type="button" className="uiMode">{ }</button>
        )}
        <button className="btnDiscret" type="button">Fazer backup</button>
      </div>
    </div>
  );
}

export default TitleBar;
