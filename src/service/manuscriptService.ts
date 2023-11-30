import IManuscript from '../domain/IManuscript';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class ManuscriptService {
  status = 'novo';

  async createScene() {
    const ID = await indexedDBrepository.idManager();
    const now = Date.now();
    if (ID) {
      const data: IManuscript = {
        title: 'Nova cena',
        category: '',
        id: ID,
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
      await indexedDBrepository.cardPost(data, 'manuscript');
    }
  }
}
const manuscriptService = new ManuscriptService();

export default manuscriptService;
