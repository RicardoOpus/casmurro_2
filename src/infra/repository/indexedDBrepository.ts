/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import db from '../database/dexieDB';
// import simpleProject from '../../mocks/simpleProject';
import IProject from '../../domain/projectModel';
import ICharacter from '../../domain/characterModel';
import IWorld from '../../domain/worldModel';

class IndexedDBrepository {
  startValueForID = 0;

  async countProjects(): Promise<number> {
    const count = await db.settings.count();
    return count;
  }

  async createDefaultSettings() {
    await db.settings.add({ currentprojectID: 0 });
  }

  getAllProjects(): Promise<IProject[]> {
    const projectsOrder = db.projects.orderBy('last_edit').reverse();
    return projectsOrder.toArray();
  }

  async getCurrentProjectID(): Promise<number> {
    const projectActual = await db.settings.toArray();
    const idProject = projectActual[0].currentprojectID;
    return idProject;
  }

  async getCurrentProject(): Promise<IProject | undefined> {
    const currentID = await this.getCurrentProjectID();
    const project = await db.projects.get(currentID);
    return project;
  }

  async deleteDB() {
    await db.delete().then(() => {
      console.log('Database successfully deleted');
    }).catch(() => {
      console.error('Could not delete database');
    });
  }

  // async populeDB() {
  //   await db.projects.add(simpleProject).then(() => {
  //     console.log('Projeto adicionado com sucesso!');
  //   });
  // }

  async updateLastEdit() {
    const projectID = await this.getCurrentProjectID();
    const now = Date.now();
    await db.projects.update(projectID, { last_edit: now });
  }

  async createNewProject(project: IProject): Promise<number> {
    const id = await db.projects.add(project).then();
    return id;
  }

  async updateSettings(idProject: number | undefined) {
    await db.settings.where('id').equals(1).modify({ currentprojectID: idProject });
  }

  async idManager(): Promise<number | null> {
    const dataProject = await this.getCurrentProject();
    if (dataProject && dataProject.id) {
      const actual = dataProject.id_controler;
      const result = actual + 1;
      await db.projects.where('id').equals(dataProject.id).modify({ id_controler: result });
      return result;
    }
    return null;
  }

  async cardPost(newData: ICharacter, table: string) {
    const projectID = await this.getCurrentProjectID();
    const projectData: IProject | undefined = await db.projects.where('id').equals(projectID).first();
    if (projectData) {
      switch (table) {
        case 'characters':
          projectData.data?.characters?.unshift(newData);
          projectData.data?.characters?.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'world':
          projectData.data?.world?.unshift(newData);
          projectData.data?.world?.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'notes':
          projectData.data?.notes?.unshift(newData);
          projectData.data?.notes?.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }
      await db.projects.where('id').equals(projectID).modify((ele: IProject) => {
        // eslint-disable-next-line no-param-reassign
        ele.data = projectData.data;
      });
      this.updateLastEdit();
    }
  }

  async characterUpdate(characterId: number, data: ICharacter) {
    const projectID = await this.getCurrentProjectID();
    const project = await db.projects.where({ id: projectID }).first();
    if (project) {
      if (!project.data) {
        project.data = { characters: [] };
      }
      const characters = project.data.characters || [];
      const characterIndex = characters.findIndex((char) => char.id === characterId);
      if (characterIndex !== -1) {
        characters[characterIndex] = data;
        project.data.characters = characters;
        await db.projects.update(projectID, { data: project.data });
        this.updateLastEdit();
        console.log('Personagem atualizado com sucesso!');
      } else {
        console.error('Personagem não encontrado no projeto.');
      }
    } else {
      console.error('Projeto não encontrado.');
    }
  }

  async worldUpdate(worldItemId: number, data: IWorld) {
    const projectID = await this.getCurrentProjectID();
    const project = await db.projects.where({ id: projectID }).first();
    if (project) {
      if (!project.data) {
        project.data = { world: [] };
      }
      const worldItens = project.data.world || [];
      const characterIndex = worldItens.findIndex((char) => char.id === worldItemId);
      if (characterIndex !== -1) {
        worldItens[characterIndex] = data;
        project.data.world = worldItens;
        await db.projects.update(projectID, { data: project.data });
        this.updateLastEdit();
        console.log('Item mundo atualizado com sucesso!');
      } else {
        console.error('Item mundo não encontrado no projeto.');
      }
    } else {
      console.error('Projeto não encontrado.');
    }
  }

  async noteUpdate(noteItemId: number, data: IWorld) {
    const projectID = await this.getCurrentProjectID();
    const project = await db.projects.where({ id: projectID }).first();
    if (project) {
      if (!project.data) {
        project.data = { notes: [] };
      }
      const notesItens = project.data.notes || [];
      const noteIndex = notesItens.findIndex((char) => char.id === noteItemId);
      if (noteIndex !== -1) {
        notesItens[noteIndex] = data;
        project.data.notes = notesItens;
        await db.projects.update(projectID, { data: project.data });
        this.updateLastEdit();
        console.log('Nota atualizado com sucesso!');
      } else {
        console.error('Nota não encontrado no projeto.');
      }
    } else {
      console.error('Projeto não encontrado.');
    }
  }

  async getCurrentCard(
    currentCardID: number,
    tableProperty: string,
  ): Promise<number | null | undefined> {
    const currProj = await this.getCurrentProject();
    if (currProj) {
      const characterData = currProj.data?.[tableProperty as keyof typeof currProj.data];
      const characterIDs = characterData?.map((e) => e.id);
      const positionInArray = characterIDs?.indexOf(currentCardID);
      return positionInArray;
    }
    return null;
  }

  async getNextAndPrevCardID(
    currentCardID: number,
    tableProperty: string,
  ): Promise<{ prevID: number | null; nextID: number | null } | undefined> {
    const currProj = await this.getCurrentProject();
    if (currProj) {
      const characterData = currProj.data?.[tableProperty as keyof typeof currProj.data];
      const characterIDs = characterData?.map((e) => e.id);
      if (characterIDs) {
        const positionInArray = characterIDs.indexOf(currentCardID);
        if (positionInArray !== -1) {
          const prevID = positionInArray > 0 ? characterIDs[positionInArray - 1] : null;
          const nextID = positionInArray < characterIDs
            .length - 1 ? characterIDs[positionInArray + 1] : null;
          return { prevID, nextID };
        }
      }
    }
    return undefined;
  }

  async deleteCard(cardID: number, table: string) {
    const currentID = await this.getCurrentProjectID();
    const currentCard = await this.getCurrentCard(cardID, table) ?? -1;
    if (currentID !== null && currentCard !== undefined) {
      db.projects.where('id').equals(currentID).modify((e) => {
        switch (table) {
          case 'characters':
            e.data?.characters?.splice(currentCard, 1);
            break;
          case 'world':
            e.data?.world?.splice(currentCard, 1);
            break;
          case 'notes':
            e.data?.notes?.splice(currentCard, 1);
            break;
          default:
            break;
        }
      });
    }
  }

  async updateProjectSettingsList(newData: string[], table: string) {
    const projectID = await this.getCurrentProjectID();
    const currentProject = await this.getCurrentProject();
    const currentSettings = currentProject?.projectSettings;
    const newSettings = { ...currentSettings, [table]: newData };
    await db.projects.update(projectID, { projectSettings: newSettings });
    this.updateLastEdit();
  }

  async updateProjectSettings(newData: string | boolean | number, table: string) {
    const projectID = await this.getCurrentProjectID();
    const currentProject = await this.getCurrentProject();
    const currentSettings = currentProject?.projectSettings;
    const newSettings = { ...currentSettings, [table]: newData };
    await db.projects.update(projectID, { projectSettings: newSettings });
    this.updateLastEdit();
  }
}

const indexedDBrepository = new IndexedDBrepository();

export default indexedDBrepository;
