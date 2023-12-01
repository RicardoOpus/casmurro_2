import ITaskList from './ITaskList';

interface IManuscript {
  id: number;
  title: string;
  category?: string;
  content?: string;
  current?: boolean;
  date?: string;
  image?: string
  last_edit: number;
  level_hierarchy?: number;
  note?: string;
  pov_id?: number;
  resume?: string;
  scene_characters?: string[];
  show_date?: boolean;
  show_notes?: boolean;
  show_taskList?: boolean;
  status?: string;
  task_list?: ITaskList[];
  type: string;
}

export default IManuscript;
