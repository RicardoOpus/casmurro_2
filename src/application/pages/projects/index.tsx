import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import casmurroLogo from '../../../../public/casmurro-logo.svg';
import IndexedDBrepository from '../../../infra/repository/indexedDBrepository';
import './projects.css';
import NoData from '../../components/no-dada';
import Project from '../../../domain/projectModel';
import ProjectList from '../../components/projects-list';
import { nextPage, previousPage } from '../../redux/actions';

type RootState = {
  paginationReducer: {
    currentPage: number,
    totalPages: number,
  }
};

function Projects() {
  const [projects, setDados] = useState<Project[]>([]);
  const projectsPerPage = 5;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [clearFilters, setClearFilters] = useState(false);

  const { paginationReducer } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const indexedDBrepository = new IndexedDBrepository();
      const projectsList = await indexedDBrepository.getAllProjects();
      setDados(projectsList);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (clearFilters) {
      setClearFilters(false);
    }
  }, [clearFilters]);

  const goNextPage = () => {
    if (paginationReducer.currentPage < Math.ceil(projects.length / 5)) {
      dispatch(nextPage());
    }
  };

  const goPreviousPage = () => {
    if (paginationReducer.currentPage > 1) {
      dispatch(previousPage());
    }
  };

  const filteredProjects = projects.filter((project) => {
    const statusMatch = !selectedStatus || project.status === selectedStatus;
    const genreMatch = !selectedGenre || project.literary_genre === selectedGenre;
    const titleMatch = !selectedTitle || project.title.includes(selectedTitle);
    return statusMatch && genreMatch && titleMatch;
  });

  const handleTitleChange = (inputTitle: string) => {
    const formattedInputTitle = inputTitle;
    setSelectedTitle(formattedInputTitle);
  };

  const clearAllFilters = () => {
    setSelectedStatus('');
    setSelectedGenre('');
    setSelectedTitle('');
    setClearFilters(true);
  };

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
        <div className="filterBar">
          <input
            type="text"
            value={selectedTitle}
            placeholder="Pesquisar por título..."
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              handleTitleChange(target.value);
            }}
          />
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
          <button type="button" onClick={clearAllFilters}>Limpar Filtros</button>
        </div>
        {projects.length === 0 ? (
          <NoData dataType="projetos" />
        ) : (
          <ProjectList
            projects={filteredProjects
              .slice(
                (paginationReducer.currentPage - 1) * projectsPerPage,
                paginationReducer.currentPage * projectsPerPage,
              )}
          />
        )}
        <div className="button-container">
          <button onClick={goPreviousPage} type="button">❮ </button>
          <span>
            Página
            {' '}
            {paginationReducer.currentPage}
            {' '}
            de
            {' '}
            {totalPages}
          </span>
          <button onClick={goNextPage} type="button"> ❯</button>
        </div>
      </div>
    </div>
  );
}

export default Projects;
