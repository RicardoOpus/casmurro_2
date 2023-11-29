import INotes from '../domain/InotesModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class NotesService {
  typeItem = 'Notas';

  async create(itemName: string) {
    const ID = await indexedDBrepository.idManager();
    const now = Date.now();
    if (ID) {
      const data: INotes = {
        title: itemName,
        id: ID,
        category: '',
        content: '',
        image: '',
        last_edit: now,
        link_list: [],
        type: this.typeItem,
        show_taskList: false,
      };
      await indexedDBrepository.cardPost(data, 'notes');
    }
  }
}

const notesService = new NotesService();

export default notesService;
