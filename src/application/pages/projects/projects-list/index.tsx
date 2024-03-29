import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IProject from '../../../../interfaces/IProject';
import utils from '../../../../service/utils';
import './projects-list.css';
import {
  currentPageAction,
  fetchProjectDataAction,
  nextPageAction, previousPageAction, totalPagesAction,
} from '../../../redux/actions/projectActions';
import { charClearState } from '../../../redux/actions/characterActions';
import FilterBar from './filter-bar';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import NotFound from '../../../components/not-found';

type RootState = {
  paginationReducer: {
    currentPage: number,
    totalPages: number
  }
};

function ProjectList({ projects }: { projects: IProject[] }) {
  const { currentPage, totalPages } = useSelector((state: RootState) => state.paginationReducer);
  const navigate = useNavigate();
  const projectsPerPage = 5;
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [clearFilters, setClearFilters] = useState(false);
  const dispatch = useDispatch();

  const goNextPage = () => {
    if (currentPage === totalPages) {
      return null;
    }
    if (currentPage < Math.ceil(projects.length / 5)) {
      dispatch(nextPageAction());
    }
    return undefined;
  };

  const goPreviousPage = () => {
    if (currentPage > 1) {
      dispatch(previousPageAction());
    }
  };

  const handleClick = (idProject: number | undefined) => {
    indexedDBrepository.updateSettings(idProject);
    dispatch(charClearState());
    dispatch(fetchProjectDataAction(true));
    navigate('/');
    window.scrollTo(0, 0);
  };

  const filteredProjects = projects.filter((project) => {
    const selectedTitleLower = selectedTitle ? selectedTitle.toLowerCase() : '';
    const titleLower = project.title.toLowerCase();
    const statusMatch = !selectedStatus || project.status === selectedStatus;
    const genreMatch = !selectedGenre || project.literary_genre === selectedGenre;
    const titleMatch = !selectedTitleLower || titleLower.includes(selectedTitleLower);
    return statusMatch && genreMatch && titleMatch;
  });

  const totalPagesList = Math.ceil(filteredProjects.length / projectsPerPage);

  const projectsSlice = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage,
  );

  const clearAllFilters = () => {
    setSelectedStatus('');
    setSelectedGenre('');
    setSelectedTitle('');
    setClearFilters(true);
  };

  const renderCardsQty = (project: IProject) => {
    const amountC = project.data?.characters?.length || 0;
    const amountW = project.data?.world?.length || 0;
    const amountN = project.data?.notes?.length || 0;
    const amountM = project.data?.manuscript?.length || 0;
    return amountC + amountW + amountN + amountM;
  };

  useEffect(() => {
    if (clearFilters) {
      setClearFilters(false);
    }
  }, [clearFilters]);

  useEffect(() => {
    dispatch(currentPageAction(1));
  }, [dispatch, selectedTitle, selectedGenre, selectedStatus]);

  useEffect(() => {
    dispatch(totalPagesAction(totalPagesList));
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
        <NotFound />
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
          <button onClick={() => handleClick(project.id)} key={project.id} className="listItens" type="button">
            <div className="projectCard">
              <div>
                <p className="projectTitle">{utils.abreviarString(project.title, 30)}</p>
                <p className="lastModify">
                  <span className="ui-icon ui-icon-calendar icon-color" />
                  Última modificação
                  {' '}
                  <strong>{utils.convertDateBR(project.last_edit)}</strong>
                  {' '}
                  às
                  {' '}
                  <strong>{utils.convertToTime(project.last_edit)}</strong>
                </p>
              </div>
              <span className="projectStatus status">{project.status}</span>
              <div>{project.literary_genre || ''}</div>
              <div className="cards">
                <p className="projectTitle">
                  <strong>{renderCardsQty(project)}</strong>
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
            {currentPage}
            {' '}
            de
            {' '}
            {totalPages}
          </span>
          <button onClick={goNextPage} type="button"> ❯</button>
        </div>
      </div>
    )
  );
}

export default ProjectList;
