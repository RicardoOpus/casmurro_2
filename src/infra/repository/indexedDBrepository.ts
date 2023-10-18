import db from '../database/dexieDB';

class IndexedDBrepository {

  async countProjects(): Promise<number> {
    const count = await db.settings.where({ currentprojectID: 0 }).count();
    return count;
  }

  async createDefaultSettings() {
    await db.settings.add({ currentprojectID: 0 });
  }
}

export default IndexedDBrepository;
