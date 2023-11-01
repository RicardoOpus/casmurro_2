import Project from '../domain/projectModel';
import IndexedDBrepository from '../infra/repository/indexedDBrepository';

class ProjectServide {
  // eslint-disable-next-line class-methods-use-this
  async create(projectName: string) {
    const indexedDBrepository = new IndexedDBrepository();
    const now = Date.now();
    const newProject: Project = {
      title: projectName,
      status: 'novo',
      last_edit: now,
      created_at: now,
      projectSettings: { object: 'value' },
      id_controler: 0,
      cards_qty: 0,
    };

    const idProject = await indexedDBrepository.createNewProject(newProject);
    indexedDBrepository.updateSettings(idProject);
  }
}

export default ProjectServide;
