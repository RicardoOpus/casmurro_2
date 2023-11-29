import ITaskList from './ITaskList';

interface IWorld {
  category?: string;
  content?: string;
  id: number;
  image?: string;
  last_edit: number,
  note?: string;
  resume?: string;
  title: string;
  type: string;
  task_list?: ITaskList[];
}

export default IWorld;
