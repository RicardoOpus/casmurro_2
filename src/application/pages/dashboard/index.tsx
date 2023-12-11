import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import IrootStateProject from '../../../domain/IrootStateProject';
import IProject from '../../../domain/projectModel';
import './dashboard.css';
import dashboardService from '../../../service/dashboardService';
import { fetchProjectDataAction } from '../../redux/actions/projectActions';
import utils from '../../../service/utils';

function Dashboard() {
  const dispatch = useDispatch();
  const project = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData));
  const [stateProject,
    setStateProject] = useState<IProject | Partial<IProject>>(project || {});

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const updatedState = { ...stateProject, [key]: e.target.value, last_edit: Date.now() };
    setStateProject(updatedState);
    dashboardService.upDate(updatedState as IProject);
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    const updatedState = { ...stateProject, [key]: e.target.value, last_edit: Date.now() };
    setStateProject(updatedState);
    dashboardService.upDate(updatedState as IProject);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    setStateProject(project || {});
  }, [project]);

  useEffect(() => {
    utils.autoGrowAllTextareas();
  }, [stateProject]);

  return (
    <div className="innerContent">
      <div className="card">
        <input
          onChange={(e) => handleInputChange(e, 'title')}
          value={stateProject.title}
          className="dashboardTitle"
          type="text"
          placeholder="Título"
          onBlur={cleanupFunction}
        />
        <input
          onChange={(e) => handleInputChange(e, 'subtitle')}
          value={stateProject?.subtitle}
          className="dashboardSubTitle"
          type="text"
          placeholder="Subtítulo"
        />
        <input
          onChange={(e) => handleInputChange(e, 'author')}
          value={stateProject?.author}
          className="dashboardAuthor"
          type="text"
          placeholder="Subtítulo"
        />
        <textarea
          className="projectResumeInput"
          placeholder="Resumo do projeto"
          value={stateProject?.projectResume}
          onChange={(e) => handleTextAreaChange(e, 'projectResume')}
        />
      </div>
    </div>
  );
}

export default Dashboard;
