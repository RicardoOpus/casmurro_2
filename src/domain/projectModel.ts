interface Project {
  id?: number;
  title: string;
  subtitle?: string;
  author?: string;
  recent_edits?: object;
  literary_genre?: string;
  description?: string;
  image_cover?: string;
  image_project?: string;
  created_at?: string;
  id_world?: number;
  id_characters?: number;
  id_scenes?: number;
  id_timeline?: number;
  id_structure?: number;
  id_notes?: number;
  lastBackup?: string;
  startDate?: string;
  finishDate?: string;
  showSubtitle?: boolean;
  status: string;
  cards_qty?: number;
  settings: object;
  last_edit: string;
  timestamp: number;
  data: object;
}

export default Project;
