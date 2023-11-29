import ITaskList from './ITaskList';

interface IWorld {
  category?: string;
  content?: string;
  date?: string,
  id: number;
  image?: string;
  last_edit: number,
  note?: string;
  resume?: string;
  show_date?: boolean;
  show_note?: boolean;
  show_taskList?: boolean;
  task_list?: ITaskList[];
  title: string;
  type: string;
}

export default IWorld;
