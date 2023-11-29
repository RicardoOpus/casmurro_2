import ITaskList from './ITaskList';

interface INotes {
  category?: string;
  content?: string;
  id: number;
  image?: string;
  last_edit: number,
  title: string;
  type: string;
  task_list?: ITaskList[];
}

export default INotes;
