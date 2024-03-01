/* eslint-disable class-methods-use-this */
import INotes from '../interfaces/INotes';
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
        type: this.typeItem,
        show_taskList: false,
      };
      await indexedDBrepository.cardPost(data, 'notes');
    }
  }

  async deleteNote(id: number) {
    await indexedDBrepository.deleteCard(Number(id), 'notes');
  }

  async upDate(idItem: number, data: INotes) {
    await indexedDBrepository.noteUpdate(idItem, data);
  }

  async upDatePosition(data: INotes[]) {
    await indexedDBrepository.cardUpdatePosition(data, 'notes');
  }
}

const notesService = new NotesService();

export default notesService;
