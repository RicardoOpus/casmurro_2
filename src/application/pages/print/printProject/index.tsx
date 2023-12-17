import { useEffect, useState } from 'react';
import IProject from '../../../../interfaces/IProject';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import IManuscript from '../../../../interfaces/IManuscript';
import './printProject.css';
import renderCharacters from './renderCharacters';
import renderProjectInfos from './renderProjectInfos';
import RednerWorld from './renderWorld';
import RednerNotes from './renderNotes';
import renderManuscript from './renderManuscript';

function PrintProject() {
  const [project, setProject] = useState<IProject>();
  const [manuscript, setManuscript] = useState<IManuscript[]>();
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  const updateDateTime = () => {
    const now = new Date();
    const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    setCurrentDateTime(formattedDateTime);
  };

  useEffect(() => {
    const fetchData = async () => {
      const projectItem = await indexedDBrepository.getCurrentProject();
      if (projectItem && projectItem.data?.manuscript) {
        setProject(projectItem);
        setManuscript(projectItem.data.manuscript);
        document.documentElement.classList.add('printMode');
        document.title = projectItem.title;
      }
    };
    fetchData();
    updateDateTime();
  }, []);

  return (
    <div className="printBody">
      <div className="titlePrintProject">
        <h1>{project?.title}</h1>
        <h2>{project?.subtitle}</h2>
        <h3>{project?.author}</h3>
      </div>
      <div className="projectStats">
        {project && renderProjectInfos(project)}
        {project?.data?.characters && renderCharacters(project.data.characters)}
        {project?.data?.world && RednerWorld(project.data.world)}
        {project?.data?.notes && RednerNotes(project.data.notes)}
        {manuscript && renderManuscript(
          manuscript,
          project?.data?.characters,
          project?.data?.world,
        )}
      </div>
      <div className="footerPrint">
        Generated by
        <a href="https://www.ricardoserafim.com.br/casmurro/">
          <img src="../casmurro-logo-small.svg" alt="Logo app" style={{ width: '120px' }} />
        </a>
        {currentDateTime}
      </div>
    </div>
  );
}

export default PrintProject;
