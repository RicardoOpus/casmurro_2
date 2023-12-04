/* eslint-disable class-methods-use-this */
import IWorld from '../domain/worldModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class WorldService {
  typeItem = 'Mundo';

  async create(itemName: string) {
    const ID = await indexedDBrepository.idManager();
    const now = Date.now();
    if (ID) {
      const data: IWorld = {
        title: itemName,
        id: ID,
        date: '',
        category: '',
        content: '',
        image: '',
        last_edit: now,
        link_list: [],
        note: '',
        resume: '',
        type: this.typeItem,
        show_date: false,
        show_note: false,
        show_taskList: false,
      };
      await indexedDBrepository.cardPost(data, 'world');
    }
  }

  async deleteWorldItem(id: number) {
    await indexedDBrepository.deleteCard(Number(id), 'world');
  }

  async upDate(idItem: number, data: IWorld) {
    await indexedDBrepository.worldUpdate(idItem, data);
  }
}

const worldService = new WorldService();

export default worldService;
