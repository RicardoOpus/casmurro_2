import IProject from './projectModel';

interface IrootStateProject {
  projectDataReducer: {
    projectData: IProject,
    hasChange: boolean,
  }
}

export default IrootStateProject;
