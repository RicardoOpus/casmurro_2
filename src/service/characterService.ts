import Character from '../domain/characterModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class CharacterService {
  defaultColor = '#8F8F8';

  async create(characterName: string) {
    const ID = await indexedDBrepository.idManager();
    if (ID) {
      const data: Character = {
        title: characterName,
        category: '',
        image: '',
        content: '',
        date_birth: '',
        date_death: '',
        gender: '',
        occupation: '',
        color: this.defaultColor,
        relations: [],
        id: ID,
      };
      indexedDBrepository.characterPost(data);
    }
  }
}

export default CharacterService;