import Dexie from 'dexie';
import IProject from '../../interfaces/IProject';
import ISettings from '../../interfaces/ISettings';

interface MyDatabase extends Dexie {
  projects: Dexie.Table<IProject, number>;
  settings: Dexie.Table<ISettings, number>;
}

const db = new Dexie('casmurro2') as MyDatabase;

db.version(1).stores({
  projects: '++id,title,status,cards_qty,settings,last_edit,timestamp,data,trash',
  settings: '++id,currentprojectID',
});

export default db;
