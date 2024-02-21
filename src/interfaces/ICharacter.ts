import ITaskList from './ITaskList';

interface Irelations {
  charID: number,
  type: string
}

interface ICharacter {
  age?: string;
  category?: string;
  color?: string;
  core_group?: string;
  content?: string;
  date_birth?: string;
  date_death?: string;
  full_name?: string;
  gender?: string;
  id: number;
  image?: string;
  last_edit: number;
  occupation?: string;
  physical?: string;
  psychological?: string;
  relations?: Irelations[];
  resume?: string;
  show_age?: boolean;
  showCharacteristics?: boolean;
  show_core_group?: boolean;
  showDate_birth?: boolean;
  showDate_death?: boolean;
  show_occupation?: boolean;
  show_full_name?: boolean;
  show_gender?: boolean;
  show_taskList?: boolean;
  task_list?: ITaskList[];
  title: string;
  transformation?: string;
  type: string;
}

export default ICharacter;
