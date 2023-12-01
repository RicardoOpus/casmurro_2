/* eslint-disable class-methods-use-this */
import IManuscript from '../domain/IManuscript';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class ManuscriptService {
  status = 'novo';

  async createScene() {
    const ID = await indexedDBrepository.idManager();
    const now = Date.now();
    if (ID) {
      const data: IManuscript = {
        id: ID,
        title: 'Nova cena',
        category: '',
        content: '',
        current: true,
        date: '',
        image: '',
        last_edit: now,
        level_hierarchy: 0,
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
      await indexedDBrepository.cardPost(data, 'manuscript');
    }
  }

  async deleteScene(idItem: number) {
    await indexedDBrepository.manuscriptDelete(idItem);
  }

  async UpScene(idItem: number) {
    await indexedDBrepository.sendUp(idItem);
  }

  async DownScene(idItem: number) {
    await indexedDBrepository.sendDown(idItem);
  }
}
const manuscriptService = new ManuscriptService();

export default manuscriptService;
