/* eslint-disable class-methods-use-this */
import IManuscript from '../interfaces/IManuscript';
import ICharacter from '../interfaces/ICharacter';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class TrashService {
  async deleteTotal(id: number) {
    await indexedDBrepository.deleteCardTrash(id);
  }

  async deleteAllTotal() {
    await indexedDBrepository.deleteAllCardTrash();
  }

  async restoreCharacter(data: ICharacter) {
    await indexedDBrepository.cardPost(data, 'characters');
    await this.deleteTotal(data.id);
  }

  async restoreWorld(data: ICharacter) {
    await indexedDBrepository.cardPost(data, 'world');
    await this.deleteTotal(data.id);
  }

  async restoreNote(data: ICharacter) {
    await indexedDBrepository.cardPost(data, 'notes');
    await this.deleteTotal(data.id);
  }

  async restoreManuscript(data: IManuscript) {
    const newTitle = `${data.title} - Restuarado da lixeira`;
    await indexedDBrepository.manuscriptPost({ ...data, current: false, title: newTitle }, 'manuscript');
    await this.deleteTotal(data.id);
  }
}

const trashService = new TrashService();

export default trashService;
