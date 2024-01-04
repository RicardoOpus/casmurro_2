import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './title-bar.css';
import titleBarService from '../../../service/titleBarService';
import indexedDBrepository from '../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction, projectDataAction } from '../../redux/actions/projectActions';
import IrootStateProject from '../../../interfaces/IRootStateProject';
import BackupModal from './backup';

function TitleBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalBackup, setModalBackup] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const {
    projectData,
    hasChange,
  } = useSelector((state: IrootStateProject) => state.projectDataReducer);
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
  }, [projectData.lastBackup]);

  useEffect(() => {
    const fontSize = localStorage.getItem('contenSize');
    const fontType = localStorage.getItem('contenTypeFont');
    document.documentElement.style.setProperty('--user-text-size', fontSize);
    document.documentElement.style.setProperty('--user-text-type', fontType);
  }, []);

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

  useEffect(() => {
    if (hasChange) {
      const fetchData = async () => {
        const projectItem = await indexedDBrepository.getCurrentProject();
        if (projectItem) {
          const color = projectItem.projectSettings.projectColor;
          document.documentElement.style.setProperty('--accent-color', color);
          dispatch(projectDataAction(projectItem));
          dispatch(fetchProjectDataAction(false));
        }
      };
      fetchData();
    }
  }, [dispatch, hasChange, projectData.projectSettings?.projectColor]);

  return (
    <div id="main-header" className="header">
      <div className="logoTitle">
        <img className="icon-color" src="./images/casmurro-logo.svg" alt="logo Casmurro" width="170px" />
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
        <button onClick={() => setModalBackup(true)} className="btnDiscret" type="button">Fazer backup</button>
      </div>
      <BackupModal openModal={modalBackup} onClose={() => setModalBackup(false)} />
    </div>
  );
}

export default TitleBar;
