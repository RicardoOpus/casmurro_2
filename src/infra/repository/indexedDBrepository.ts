/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import db from '../database/dexieDB';
import simpleProject from '../../mocks/simpleProject';
import ProjectDTO from '../../domain/projectModel';

class IndexedDBrepository {
  async countProjects(): Promise<number> {
    const count = await db.settings.count();
    return count;
  }

  async createDefaultSettings() {
    await db.settings.add({ currentprojectID: 0 });
  }

  getAllProjects() {
    const projectsOrder = db.projects.orderBy('last_edit').reverse();
    return projectsOrder.toArray();
  }

  async deleteDB() {
    await db.delete().then(() => {
      console.log('Database successfully deleted');
    }).catch(() => {
      console.error('Could not delete database');
    });
  }

  async populeDB() {
    await db.projects.add(simpleProject).then(() => {
      console.log('Projeto adicionado com sucesso!');
    });
  }

  async createNewProject(project: ProjectDTO) {
    const id = await db.projects.add(project).then();
    return id;
  }

  async updateSettings(idProject: number) {
    await db.settings.where('id').equals(1).modify({ currentprojectID: idProject });
  }
}

export default IndexedDBrepository;
