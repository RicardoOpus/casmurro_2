/* eslint-disable class-methods-use-this */
import IManuscript from '../domain/IManuscript';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class ManuscriptService {
  status = 'Novo';

  async createScene(id: number, type: string) {
    const ID = await indexedDBrepository.idManager();
    const now = Date.now();
    const title = type === 'Cena' ? 'Nova Cena' : 'Novo Capítulo';
    if (ID) {
      const data: IManuscript = {
        id: ID,
        title,
        content: '',
        current: false,
        date: '',
        goalWC: '',
        image: '',
        last_edit: now,
        level_hierarchy: 0,
        link_list: [],
        note: '',
        place: 0,
        pov_id: 0,
        resume: '',
        scene_characters: [],
        show_date: false,
        show_goalWC: false,
        show_pov: false,
        show_place: false,
        show_notes: false,
        show_taskList: false,
        show_time: false,
        show_weather: false,
        status: this.status,
        task_list: [],
        time: '',
        type,
        weather: '',
      };
      if (id === 0) {
        await indexedDBrepository.manuscriptPost(data, 'manuscript');
      } else {
        await indexedDBrepository.manuscriptAdd(id, data);
      }
    }
  }

  async deleteScene(idItem: number) {
    await indexedDBrepository.sendManuscriptTrash(idItem);
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

  async updateCurrent(idItem: number) {
    await indexedDBrepository.manuscriptCurrentHandle(idItem);
  }

  async upDate(idItem: number, data: IManuscript) {
    await indexedDBrepository.manuscriptUpdate(idItem, data);
  }
}
const manuscriptService = new ManuscriptService();

export default manuscriptService;
