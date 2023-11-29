import ILinks from './ILinks';
import ITaskList from './ITaskList';

interface INotes {
  category?: string;
  content?: string;
  id: number;
  image?: string;
  last_edit: number,
  link_list?: ILinks[]
  title: string;
  type: string;
  task_list?: ITaskList[];
  show_taskList?: boolean;
}

export default INotes;
