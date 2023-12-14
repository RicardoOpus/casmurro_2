import IProject from './IProject';

interface IrootStateProject {
  projectDataReducer: {
    projectData: IProject,
    hasChange: boolean,
  }
}

export default IrootStateProject;
