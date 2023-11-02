import IndexedDBrepository from '../infra/repository/indexedDBrepository';

class StartChecks {
  startCount = 0;

  async hasProjects(): Promise<boolean> {
    const indexedDBrepository = new IndexedDBrepository();
    const count = await indexedDBrepository.countProjects();

    if (count === this.startCount) {
      await indexedDBrepository.createDefaultSettings();
      return false;
    }
    return true;
  }
}

export default StartChecks;
