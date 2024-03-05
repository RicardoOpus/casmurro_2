import ITaskList from './ITaskList';

interface IManuscript {
  id: number;
  title: string;
  content?: string;
  current?: boolean;
  date?: string;
  goalWC?: string;
  image?: string
  last_edit: number;
  note?: string;
  place?: number;
  pov_id?: number;
  resume?: string;
  scene_characters?: number[];
  show_date?: boolean;
  show_goalWC?: boolean;
  show_pov?: boolean;
  show_place?: boolean;
  show_notes?: boolean;
  show_taskList?: boolean;
  show_time?: boolean;
  show_weather?: boolean;
  status?: string;
  task_list?: ITaskList[];
  time?: string;
  type: string;
  weather?: string;
}

export default IManuscript;
