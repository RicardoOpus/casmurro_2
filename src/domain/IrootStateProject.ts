import Project from './projectModel';

interface IrootStateProject {
  projectDataReducer: {
    projectData: Project,
    hasChange: boolean,
  }
}

export default IrootStateProject;
