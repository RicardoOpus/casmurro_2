import ITaskList from './ITaskList';

interface IManuscript {
  category?: string;
  children?: IManuscript[];
  content?: string;
  date?: string;
  id: number;
  image?: string;
  last_edit: number;
  note?: string;
  pov_id?: number;
  resume?: string;
  scene_characters?: string[];
  show_date?: boolean;
  show_notes?: boolean;
  show_taskList?: boolean;
  status?: string;
  task_list?: ITaskList[];
  title: string;
  type: string;
}

export default IManuscript;
