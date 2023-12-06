import IManuscript from './IManuscript';
import INotes from './InotesModel';
import ICharacter from './characterModel';
import IWorld from './worldModel';

interface IProject {
  title: string;
  status: string;
  last_edit: number;
  created_at: number;
  projectSettings: {
    projectColor: string,
    typeWriterSound: boolean,
    typeWriterVolume: number,
    charactersCategory: string[],
    charactersGenders: string[],
    charactersCoreGroupes: string[],
    worldCategory: string[],
    notesCategory: string[],
    manuscriptStatus: string[],
    manuscriptWeather: string[],
    manuscriptShowPovColor: boolean,
    manuscriptShowWC: boolean,
    manuscriptShowChecks: boolean,
  };
  id_controler: number;
  cards_qty: number;
  lastBackup: number;
  id?: number;
  data?: {
    characters?: ICharacter[];
    world?: IWorld[];
    notes?: INotes[];
    manuscript?: IManuscript[];
    trash?: ICharacter[] | IWorld[] | INotes[] | IManuscript[];
  };
  subtitle?: string;
  author?: string;
  recent_edits?: object;
  literary_genre?: string;
  description?: string;
  image_cover?: string;
  image_project?: string;
  startDate?: string;
  finishDate?: string;
  showSubtitle?: boolean;
}

export default IProject;
