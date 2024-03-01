import ITaskList from './ITaskList';

interface INotes {
  category?: string;
  content?: string;
  id: number;
  image?: string;
  last_edit: number,
  resume?: string;
  title: string;
  type: string;
  task_list?: ITaskList[];
  show_taskList?: boolean;
}

export default INotes;
