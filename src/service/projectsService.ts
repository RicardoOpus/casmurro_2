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
          'Mascote',
          'Protagonista',
          'Secundário',
          'Vilão',
        ],
        charactersGenrders: [
          'Masculino',
          'Feminino',
          'Não-Binário',
          'Gênero Fluído',
          'Agênero',
          'Transexual',
          'Genderqueer',
          'Outro',
        ],
        projectColor: '#0099ff',
      },
      id_controler: 0,
      cards_qty: 0,
      data: {
        characters: [],
        world: [],
      },
    };

    const idProject = await indexedDBrepository.createNewProject(newProject);
    indexedDBrepository.updateSettings(idProject);
  }
}

export default ProjectServide;
