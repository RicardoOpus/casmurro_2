import Project from '../../../domain/projectModel';
import { convertDateBR, convertToTime } from '../../../service/utils';
import './projects-list.css';

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    projects.length === 0 ? (
      <h3>nada encontrado</h3>
    ) : (
      <div className="projectsList">
        {projects.map((project) => (
          <button key={project.id} className="projectsItens" type="button">
            <div className="projectCard">
              <div>
                <p className="projectTitle">{project.title}</p>
                <p className="lastModify">
                  <span className="ui-icon ui-icon-calendar" />
                  Última modificação
                  {' '}
                  <strong>{convertDateBR(project.timestamp)}</strong>
                  {' '}
                  às
                  {' '}
                  <strong>{convertToTime(project.timestamp)}</strong>
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
      </div>
    )
  );
}

export default ProjectList;
