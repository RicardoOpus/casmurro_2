import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Project from '../../../domain/projectModel';
import { convertDateBR, convertToTime } from '../../../service/utils';
import './projects-list.css';
import {
  currentPage,
  nextPage, previousPage, totalPages,
} from '../../redux/actions';
import FilterBar from './filter-bar';
import nodata from '../../../../public/no-data.png';

type RootState = {
  paginationReducer: {
    currentPage: number,
    totalPages: number
  }
};

function ProjectList({ projects }: { projects: Project[] }) {
  const { paginationReducer } = useSelector((state: RootState) => state);
  const projectsPerPage = 5;
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [clearFilters, setClearFilters] = useState(false);

  const dispatch = useDispatch();

  const goNextPage = () => {
    if (paginationReducer.currentPage === paginationReducer.totalPages) {
      return null;
    }
    if (paginationReducer.currentPage < Math.ceil(projects.length / 5)) {
      dispatch(nextPage());
    }
    return undefined;
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

  const totalPagesList = Math.ceil(filteredProjects.length / projectsPerPage);

  const projectsSlice = filteredProjects.slice(
    (paginationReducer.currentPage - 1) * projectsPerPage,
    paginationReducer.currentPage * projectsPerPage,
  );

  const clearAllFilters = () => {
    setSelectedStatus('');
    setSelectedGenre('');
    setSelectedTitle('');
    setClearFilters(true);
  };

  useEffect(() => {
    if (clearFilters) {
      setClearFilters(false);
    }
  }, [clearFilters]);

  useEffect(() => {
    dispatch(currentPage(1));
  }, [dispatch, selectedTitle, selectedGenre, selectedStatus]);

  useEffect(() => {
    dispatch(totalPages(totalPagesList));
  }, [dispatch, totalPagesList]);

  return (
    projectsSlice.length === 0 ? (
      <div className="projectsList">
        <FilterBar
          selectedStatus={selectedStatus}
          selectedGenre={selectedGenre}
          selectedTitle={selectedTitle}
          setSelectedStatus={setSelectedStatus}
          setSelectedGenre={setSelectedGenre}
          setSelectedTitle={setSelectedTitle}
          clearAllFilters={clearAllFilters}
        />
        <div className="dataNotFound">
          <img className="icon-color" src={nodata} alt="ilustração lupa" />
          <h3>nada encontrado</h3>
        </div>
      </div>
    ) : (
      <div className="projectsList">
        <FilterBar
          selectedStatus={selectedStatus}
          selectedGenre={selectedGenre}
          selectedTitle={selectedTitle}
          setSelectedStatus={setSelectedStatus}
          setSelectedGenre={setSelectedGenre}
          setSelectedTitle={setSelectedTitle}
          clearAllFilters={clearAllFilters}
        />

        {projectsSlice.map((project) => (
          <button key={project.id} className="projectsItens" type="button">
            <div className="projectCard">
              <div>
                <p className="projectTitle">{project.title}</p>
                <p className="lastModify">
                  <span className="ui-icon ui-icon-calendar icon-color" />
                  Última modificação
                  {' '}
                  <strong>{convertDateBR(project.last_edit)}</strong>
                  {' '}
                  às
                  {' '}
                  <strong>{convertToTime(project.last_edit)}</strong>
                </p>
              </div>
              <span className="projectStatus novo">{project.status}</span>
              <div>{project.literary_genre || ''}</div>
              <div className="cards">
                <p className="projectTitle">
                  <strong>{project.cards_qty || '0'}</strong>
                </p>
                <p className="cardsQTY">Cartões</p>
              </div>
            </div>
          </button>
        ))}
        <div className="button-container">
          <button onClick={goPreviousPage} type="button">❮ </button>
          <span>
            Página
            {' '}
            {paginationReducer.currentPage}
            {' '}
            de
            {' '}
            {paginationReducer.totalPages}
          </span>
          <button onClick={goNextPage} type="button"> ❯</button>
        </div>
      </div>
    )
  );
}

export default ProjectList;
