import Dexie from "dexie";
import Project from "../models/projectModel";
import Settings from "../models/settingsModel";

interface MyDatabase extends Dexie {
  projects: Dexie.Table<Project, number>;
  settings: Dexie.Table<Settings, number>;
}

const db = new Dexie('casmurro2') as MyDatabase;

db.version(1).stores({
  projects: '++id,title,status,cards_qty,settings,last_edit,timestamp,data,trash',
  settings: 'currentproject',
});

export default db;
