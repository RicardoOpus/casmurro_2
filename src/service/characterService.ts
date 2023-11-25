import ICharacter from '../domain/characterModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class CharacterService {
  defaultColor = '#898989';

  async create(characterName: string) {
    const ID = await indexedDBrepository.idManager();
    const now = Date.now();
    if (ID) {
      const data: ICharacter = {
        age: '',
        category: '',
        color: this.defaultColor,
        content: '',
        core_group: '',
        date_birth: '',
        date_death: '',
        gender: '',
        id: ID,
        image: '',
        last_edit: now,
        note: '',
        occupation: '',
        relations: [],
        resume: '',
        title: characterName,
        type: 'Personagem',
      };
      await indexedDBrepository.cardPost(data, 'characters');
    }
  }
}
const characterService = new CharacterService();

export default characterService;
