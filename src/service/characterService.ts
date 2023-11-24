import ICharacter from '../domain/characterModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class CharacterService {
  defaultColor = '#898989';

  async create(characterName: string) {
    const ID = await indexedDBrepository.idManager();
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
        note: '',
        occupation: '',
        relations: [],
        resume: '',
        title: characterName,
      };
      await indexedDBrepository.characterPost(data);
    }
  }
}

export default CharacterService;
