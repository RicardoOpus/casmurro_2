/* eslint-disable class-methods-use-this */
import IProject from '../interfaces/IProject';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class ProjectServide {
  deafultStatus = 'Novo';

  async create(projectName: string) {
    const now = Date.now();
    const newProject: IProject = {
      title: projectName,
      subtitle: '',
      showSubtitle: false,
      author: '',
      showAuthor: false,
      status: this.deafultStatus,
      literary_genre: '',
      projectResume: '',
      last_edit: now,
      created_at: now,
      lastBackup: 0,
      projectSettings: {
        charactersCategory: [
          'Antagonista',
          'Coadjuvante',
          'Criatura',
          'Entidade',
          'Herói',
          'Principais',
          'Protagonista',
          'Secundários',
          'Vilão',
        ],
        charactersGenders: [
          'Masculino',
          'Feminino',
          'Não-Binário',
          'Gênero Fluído',
          'Agênero',
          'Transexual',
          'Outro',
        ],
        charactersCoreGroupes: [
          'Nenhum',
        ],
        worldCategory: [
          'Nenhum',
          'Local',
          'Objeto',
          'Fato histórico',
        ],
        notesCategory: [
          'Geral',
          'Ideia',
          'Pesquisa',
          'Cronograma',
          'Notas de Revisão',
          'Diário de bordo',
          'Playlist',
        ],
        manuscriptStatus: [
          'Novo',
          'Pronto',
          'Revisado',
          'Em andamento',
          'Pausado',
          'Problema',
          'Não iniciado',
        ],
        manuscriptWeather: [
          'Normal',
          'Ensolarado',
          'Chuvoso',
          'Tempestuoso',
          'Neve',
          'Nublado',
          'Seco',
          'Quente',
          'Frio',
          'Úmido',
          'Vento',
          'Granizo',
          'Neblina',
        ],
        manuscriptPersonalWords: [],
        manuscriptShowPovColor: false,
        manuscriptShowWC: false,
        manuscriptShowChecks: false,
        manuscriptShowSynopsis: false,
        projectColor: '#0099ff',
        typeWriterSound: false,
        typeWriterVolume: 0.5,
        manuscriptHideChaptersTitles: false,
        manuscriptHideScenesTitles: false,
      },
      id_controler: 0,
      data: {
        characters: [],
        world: [],
        notes: [],
        manuscript: [],
        trash: [],
      },
    };

    const idProject = await indexedDBrepository.createNewProject(newProject);
    indexedDBrepository.updateSettings(idProject);
  }

  verifyFileExtension(filePath: string) {
    return filePath.endsWith('.json');
  }

  hasRequiredKeys(obj: IProject | undefined) {
    return obj && ('title' in obj) && ('id' in obj) && ('data' in obj);
  }

  async importJson(obj: IProject) {
    const idProject = await indexedDBrepository.createNewProject(obj);
    indexedDBrepository.updateSettings(idProject);
  }
}

const projectServide = new ProjectServide();

export default projectServide;
