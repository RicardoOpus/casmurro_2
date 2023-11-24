import ICharacter from './characterModel';
import IWorld from './worldModel';

interface IProject {
  title: string;
  status: string;
  last_edit: number;
  created_at: number;
  projectSettings: {
    charactersCategory: string[],
    charactersGenders: string[],
    charactersCoreGroupes: string[],
    projectColor: string,
    typeWriterSound: boolean,
    typeWriterVolume: number,
  };
  id_controler: number;
  cards_qty: number;
  lastBackup: number;
  id?: number;
  data?: {
    characters?: ICharacter[];
    world?: IWorld[];
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
