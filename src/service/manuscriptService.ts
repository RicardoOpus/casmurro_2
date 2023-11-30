/* eslint-disable class-methods-use-this */
import IManuscript from '../domain/IManuscript';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class ManuscriptService {
  status = 'novo';

  async createScene(idItem: string, typePosition: string) {
    const ID = await indexedDBrepository.idManager();
    const now = Date.now();
    if (ID) {
      const data: IManuscript = {
        id: ID,
        title: 'Nova cena',
        category: '',
        children: [],
        content: '',
        date: '',
        image: '',
        last_edit: now,
        note: '',
        pov_id: 0,
        resume: '',
        scene_characters: [],
        show_date: false,
        show_notes: false,
        show_taskList: false,
        status: this.status,
        task_list: [],
        type: 'Cena',
      };
      switch (typePosition) {
        case 'sibling':
          await indexedDBrepository.manuscriptPostAsSibling(data, idItem);
          break;
        case 'child':
          await indexedDBrepository.manuscriptPost(data, idItem);
          break;
        default:
          await indexedDBrepository.cardPost(data, 'manuscript');
          break;
      }
    }
  }

  async deleteScene(idItem: number, path: string) {
    await indexedDBrepository.manuscriptDelete(idItem, path);
  }
}
const manuscriptService = new ManuscriptService();

export default manuscriptService;
