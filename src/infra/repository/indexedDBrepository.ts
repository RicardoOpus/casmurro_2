/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import db from '../database/dexieDB';
import simpleProject from '../../mocks/simpleProject';
import Project from '../../domain/projectModel';
import Character from '../../domain/characterModel';

class IndexedDBrepository {
  startValueForID = 0;

  async countProjects(): Promise<number> {
    const count = await db.settings.count();
    return count;
  }

  async createDefaultSettings() {
    await db.settings.add({ currentprojectID: 0 });
  }

  getAllProjects(): Promise<Project[]> {
    const projectsOrder = db.projects.orderBy('last_edit').reverse();
    return projectsOrder.toArray();
  }

  async getCurrentProjectID(): Promise<number> {
    const projectActual = await db.settings.toArray();
    const idProject = projectActual[0].currentprojectID;
    return idProject;
  }

  async getCurrentProject(): Promise<Project | undefined> {
    const currentID = await this.getCurrentProjectID();
    const project = await db.projects.get(currentID);
    return project;
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

  async createNewProject(project: Project): Promise<number> {
    const id = await db.projects.add(project).then();
    return id;
  }

  async updateSettings(idProject: number | undefined) {
    await db.settings.where('id').equals(1).modify({ currentprojectID: idProject });
  }

  async idManager(): Promise<number | null> {
    const dataProject = await this.getCurrentProject();
    if (dataProject && dataProject.id) {
      const actual = dataProject.id_controler;
      const result = actual + 1;
      await db.projects.where('id').equals(dataProject.id).modify({ id_controler: result });
      return result;
    }
    return null;
  }

  async characterPost(newData: Character) {
    const projectID = await this.getCurrentProjectID();

    db.projects.where('id').equals(projectID).modify((ele: Project) => {
      ele?.data?.characters.push(newData);
    });
  }
}

const indexedDBrepository = new IndexedDBrepository();

export default indexedDBrepository;
