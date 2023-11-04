import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import './title-bar.css';
import IndexedDBrepository from '../../../infra/repository/indexedDBrepository';
import Project from '../../../domain/projectModel';
import TitleBarService from '../../../service/titleBarService';

function TitleBar() {
  const titleBarService = useMemo(() => new TitleBarService(), []);
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useState(false);
  const [project, setProject] = useState<Project>();
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
    const fetchData = async () => {
      const indexedDBrepository = new IndexedDBrepository();
      const projectItem = await indexedDBrepository.getCurrentProject();
      setProject(projectItem);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const mensage = titleBarService.backupMensage(project?.lastBackup);
    setbackupWarning(mensage);
  }, [project?.lastBackup, titleBarService]);

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
      <p className="projectTitle">{titleBarService.titleReduction(project?.title || '') }</p>
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
