import { useEffect, useState } from 'react';
import casmurroLogo from '../../../../public/casmurro-logo.svg';
import IndexedDBrepository from '../../../infra/repository/indexedDBrepository';
import './projects.css';
import NoData from '../../components/no-dada';
import Project from '../../../domain/projectModel';
import ProjectList from '../../components/projects-list';

function Projects() {
  const [projects, setDados] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const indexedDBrepository = new IndexedDBrepository();
      const projectsList = await indexedDBrepository.getAllProjects();
      setDados(projectsList);
    };

    fetchData();
  }, []);

  return (
    <div className="innerContent">
      <div className="projectsPage">
        <img src={casmurroLogo} className="projectsPageImg" alt="logo casmurro" />
        <h3 className="welcome app-subtitle">Escreva com paixão, organize com precisão</h3>
        <div>
          <button type="button" className="btnNewProject">
            <span className="ui-icon ui-icon-plusthick" />
            {' '}
            Novo Projeto
          </button>
          <div className="separator" />
          <button type="button" className="btnImport">
            <span className="ui-icon ui-icon-arrowthick-1-n" />
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
    </div>
  );
}

export default Projects;
