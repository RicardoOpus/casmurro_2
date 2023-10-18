import db from "./dexieDB";

class StartChecks {
  async hasProjects(): Promise<boolean> {
    const count = await db.settings.where({ currentproject: 0 }).count();

    if (count === 0) {
      await db.settings.add({ currentproject: 0 });
      return false;
    }
    return true;
  }
}

export default StartChecks;
