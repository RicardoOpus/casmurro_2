import { useEffect, useState } from 'react';
import casmurroLogo from '../../../../public/casmurro-logo.svg';
import IndexedDBrepository from '../../../infra/repository/indexedDBrepository';
import './projects.css';
import NoData from '../../components/no-dada';
import Project from '../../../domain/projectModel';
import ProjectList from '../../components/projects-list';

function Projects() {
  const [projects, setDados] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const indexedDBrepository = new IndexedDBrepository();
      const projectsList = await indexedDBrepository.getAllProjects();
      setDados(projectsList);
    };

    fetchData();
  }, []);

  const nextPage = () => {
    if (currentPage < Math.ceil(projects.length / 5)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const statusMatch = !selectedStatus || project.status === selectedStatus;
    const genreMatch = !selectedGenre || project.literary_genre === selectedGenre;

    return statusMatch && genreMatch;
  });

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
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="Arquivado">Arquivado</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Não iniciado">Não iniciado</option>
            <option value="Pausado">Pausado</option>
          </select>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Todos os Gêneros</option>
            <option value="Romance">Romance</option>
            <option value="Conto">Conto</option>
          </select>
        </div>
        {projects.length === 0 ? (
          <NoData dataType="projetos" />
        ) : (
          <ProjectList
            projects={filteredProjects
              .slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage)}
          />
        )}
        <div className="button-container">
          <button onClick={previousPage} type="button">❮ </button>
          <span>
            Página
            {' '}
            {currentPage}
            {' '}
            de
            {' '}
            {totalPages}
          </span>
          <button onClick={nextPage} type="button"> ❯</button>
        </div>
      </div>
    </div>
  );
}

export default Projects;
