import IndexedDBrepository from "../infra/repository/indexedDBrepository";

class StartChecks {
  async hasProjects(): Promise<boolean> {
    const indexedDBrepository = new IndexedDBrepository;
    const count = await indexedDBrepository.countProjects()

    if (count === 0) {
      await indexedDBrepository.createDefaultSettings();
      return false;
    }
    return true;
  }

}

export default StartChecks;
