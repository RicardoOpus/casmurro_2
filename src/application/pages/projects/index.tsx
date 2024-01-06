import { useEffect, useState } from 'react';
import casmurroLogo from '../../../../public/images/casmurro-logo.svg';
import indexedDBrepository from '../../../infra/repository/indexedDBrepository';
import './projects.css';
import NoData from '../../components/no-dada';
import IProject from '../../../interfaces/IProject';
import ProjectList from './projects-list';
import NewProjectModal from './new-project-modal';
import ImportProjectModal from './import-project-modal';

function Projects() {
  const [projects, setDados] = useState<IProject[]>([]);
  const [modal, setModal] = useState(false);
  const [modalImport, setModalImport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const projectsList = await indexedDBrepository.getAllProjects();
      setDados(projectsList);
    };

    fetchData();
  }, []);

  return (
    <div className="projectInnerContent">
      <div className="projectsPage">
        <img src={casmurroLogo} className="projectsPageImg icon-color" alt="logo casmurro" />
        <h3 className="welcome app-subtitle">Escreva com paixão, organize com precisão</h3>
        <div>
          <button onClick={() => setModal(true)} type="button" className="btnNewProject">
            <span className="ui-icon ui-icon-plusthick icon-color" />
            {' '}
            Novo Projeto
          </button>
          <div className="separator" />
          <button onClick={() => setModalImport(true)} type="button" className="btnImport">
            <span className="ui-icon ui-icon-arrowthick-1-n icon-color" />
            {' '}
            Importar
          </button>
        </div>
        {projects.length === 0 ? (
          <NoData dataType="projetos" />
        ) : (
          <ProjectList
            projects={projects}
          />
        )}
      </div>
      <NewProjectModal openModal={modal} onClose={() => setModal(false)} />
      <ImportProjectModal openModal={modalImport} onClose={() => setModalImport(false)} />
    </div>
  );
}

export default Projects;
