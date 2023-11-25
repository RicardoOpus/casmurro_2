import IWorld from '../domain/worldModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class WorldService {
  typeItem = 'Mundo';

  async create(itemName: string) {
    const ID = await indexedDBrepository.idManager();
    const now = Date.now();
    if (ID) {
      const data: IWorld = {
        category: '',
        content: '',
        id: ID,
        image: '',
        last_edit: now,
        note: '',
        resume: '',
        title: itemName,
        type: this.typeItem,
      };
      await indexedDBrepository.cardPost(data, 'world');
    }
  }
}

const worldService = new WorldService();

export default worldService;
