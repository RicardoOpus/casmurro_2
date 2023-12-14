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
    manuscriptPersonalWords: string[],
  };
  id_controler: number;
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
  showSubtitle?: boolean;
  author?: string;
  showAuthor?: boolean;
  literary_genre?: string;
  projectResume?: string;
  image_project?: string;
  startDate?: string;
  finishDate?: string;
}

export default IProject;
