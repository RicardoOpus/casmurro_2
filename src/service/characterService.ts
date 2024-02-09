/* eslint-disable class-methods-use-this */
import ICharacter from '../interfaces/ICharacter';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class CharacterService {
  defaultColor = '#898989';

  async create(characterName: string) {
    const ID = await indexedDBrepository.idManager();
    const now = Date.now();
    if (ID) {
      const data: ICharacter = {
        title: characterName,
        id: ID,
        age: '',
        category: '',
        color: this.defaultColor,
        content: '',
        core_group: '',
        date_birth: '',
        date_death: '',
        gender: '',
        image: '',
        last_edit: now,
        link_list: [],
        note: '',
        occupation: '',
        physical: '',
        psychological: '',
        relations: [],
        task_list: [],
        resume: '',
        type: 'Personagem',
        show_age: false,
        show_core_group: false,
        show_gender: false,
        show_occupation: false,
        showCharacteristics: false,
        showDate_birth: false,
        showDate_death: false,
        show_taskList: false,
        show_full_name: false,
        show_notes: false,
      };
      await indexedDBrepository.cardPost(data, 'characters');
    }
  }

  async deleteChar(id: number) {
    await indexedDBrepository.deleteCard(Number(id), 'characters');
  }

  async upDate(idItem: number, data: ICharacter) {
    await indexedDBrepository.characterUpdate(idItem, data);
  }

  async upDatePosition(data: ICharacter[]) {
    await indexedDBrepository.cardUpdatePosition(data, 'characters');
  }
}
const characterService = new CharacterService();

export default characterService;
