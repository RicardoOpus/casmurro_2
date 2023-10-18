/* eslint-disable no-console */
import db from '../database/dexieDB';
import simpleProject from '../../mocks/simpleProject';

class IndexedDBrepository {
  private db;

  constructor() {
    this.db = db;
  }

  async countProjects(): Promise<number> {
    const count = await this.db.settings.where({ currentprojectID: 0 }).count();
    return count;
  }

  async createDefaultSettings() {
    await this.db.settings.add({ currentprojectID: 0 });
  }

  async deleteDB() {
    await this.db.delete().then(() => {
      console.log('Database successfully deleted');
    }).catch(() => {
      console.error('Could not delete database');
    });
  }

  async populeDB() {
    await this.db.projects.add(simpleProject).then(() => {
      console.log('Projeto adicionado com sucesso!');
    });
  }
}

export default IndexedDBrepository;
