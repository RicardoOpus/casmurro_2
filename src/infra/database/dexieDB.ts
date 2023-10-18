import Dexie from "dexie";
import Project from "../../domain/projectModel";
import Settings from "../../domain/settingsModel";

interface MyDatabase extends Dexie {
  projects: Dexie.Table<Project, number>;
  settings: Dexie.Table<Settings, number>;
}

const db = new Dexie('casmurro2') as MyDatabase;

db.version(1).stores({
  projects: '++id,title,status,cards_qty,settings,last_edit,timestamp,data,trash',
  settings: 'currentprojectID',
});

export default db;
