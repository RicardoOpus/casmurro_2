/* eslint-disable class-methods-use-this */
import IManuscript from '../domain/IManuscript';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class ManuscriptService {
  status = 'novo';

  async createScene(id: number, type: string) {
    const ID = await indexedDBrepository.idManager();
    const now = Date.now();
    const title = type === 'Cena' ? 'Nova Cena' : 'Novo Capítulo';
    if (ID) {
      const data: IManuscript = {
        id: ID,
        title,
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
        type,
      };
      if (id === 0) {
        await indexedDBrepository.manuscriptPost(data, 'manuscript');
      } else {
        await indexedDBrepository.manuscriptAdd(id, data);
      }
    }
  }

  async deleteScene(idItem: number) {
    await indexedDBrepository.manuscriptDelete(idItem);
  }

  async UpScene(idItem: number) {
    await indexedDBrepository.SceneSendUp(idItem);
  }

  async DownScene(idItem: number) {
    await indexedDBrepository.SceneSendDown(idItem);
  }

  async levelScene(idItem: number, toIncrease: boolean) {
    await indexedDBrepository.SceneModifyLevel(idItem, toIncrease);
  }
}
const manuscriptService = new ManuscriptService();

export default manuscriptService;
