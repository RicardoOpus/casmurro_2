import IWorld from '../domain/worldModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class WorldService {
  // eslint-disable-next-line class-methods-use-this
  async create(itemName: string) {
    const ID = await indexedDBrepository.idManager();
    if (ID) {
      const data: IWorld = {
        category: '',
        content: '',
        id: ID,
        image: '',
        note: '',
        resume: '',
        title: itemName,
      };
      await indexedDBrepository.cardPost(data, 'world');
    }
  }
}

const worldService = new WorldService();

export default worldService;
