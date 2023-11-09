import Character from './characterModel';
import World from './worldModel';

interface Project {
  title: string;
  status: string;
  last_edit: number;
  created_at: number;
  projectSettings: {
    charactersCategory: string[],
    charactersGenrders: string[],
    projectColor: string,
  };
  id_controler: number;
  cards_qty: number;
  lastBackup: number;
  id?: number;
  data?: {
    characters?: Character[];
    world?: World[];
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

export default Project;
