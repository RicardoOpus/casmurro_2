import IProject from '../domain/projectModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class ProjectServide {
  deafultStatus = 'novo';

  async create(projectName: string) {
    const now = Date.now();
    const newProject: IProject = {
      title: projectName,
      status: this.deafultStatus,
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
        projectColor: '#0099ff',
        typeWriterSound: false,
        typeWriterVolume: 0.5,
      },
      id_controler: 0,
      cards_qty: 0,
      data: {
        characters: [],
        world: [],
        notes: [],
      },
    };

    const idProject = await indexedDBrepository.createNewProject(newProject);
    indexedDBrepository.updateSettings(idProject);
  }
}

export default ProjectServide;
