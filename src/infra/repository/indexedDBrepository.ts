import db from '../database/dexieDB';
import simpleProject from '../../mocks/simpleProject';

class IndexedDBrepository {

  async countProjects(): Promise<number> {
    const count = await db.settings.where({ currentprojectID: 0 }).count();
    return count;
  }

  async createDefaultSettings() {
    await db.settings.add({ currentprojectID: 0 });
  }

  async deleteDB() {
    await db.delete().then(() => {
      console.log("Database successfully deleted");
    }).catch(() => {
      console.error("Could not delete database");
    })
  }

  async populeDB() {
    await db.projects.add(simpleProject).then(() => {
      console.log('Projeto adicionado com sucesso!');
    });
  }

}

export default IndexedDBrepository;
