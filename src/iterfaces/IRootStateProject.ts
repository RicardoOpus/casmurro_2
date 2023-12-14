import IProject from './IProjectModel';

interface IrootStateProject {
  projectDataReducer: {
    projectData: IProject,
    hasChange: boolean,
  }
}

export default IrootStateProject;
