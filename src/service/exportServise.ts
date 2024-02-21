/* eslint-disable class-methods-use-this */
import IManuscript from '../interfaces/IManuscript';
import IProject from '../interfaces/IProject';
import indexedDBrepository from '../infra/repository/indexedDBrepository';
import utils from './utils';
import exportLabels from '../templates/exportLabels';
import ICharacter from '../interfaces/ICharacter';
import IWorld from '../interfaces/IWorld';
import INotes from '../interfaces/INotes';

class ExportService {
  generateDraftHeader(project: IProject): string {
    let text = '';
    text += `Título:\n  ${project.title}\n\n`;
    if (project.subtitle) {
      text += `Subtítulo:\n  ${project.subtitle}\n\n`;
    } if (project.author) {
      text += `Autor:\n  ${project.author}\n\n`;
    }
    return text;
  }

  generateProjectInfos(project: IProject): string {
    let text = '';
    if (project.status) {
      text += `Status:\n  ${project.status}\n\n`;
    } if (project.literary_genre) {
      text += `Tipo literário:\n  ${project.literary_genre}\n\n`;
    } if (project.startDate) {
      text += `Data inícial:\n  ${utils.convertDatePTBR(project.startDate)}\n\n`;
    } if (project.finishDate) {
      text += `Data final:\n  ${utils.convertDatePTBR(project.finishDate)}\n\n`;
    } if (project.projectResume) {
      text += `Resumo:\n  ${project.projectResume}\n\n`;
    }
    return text;
  }

  generateCharacters(characters: ICharacter[]): string {
    let text = '';
    text += exportLabels.getPersonagensLabel();
    if (characters) {
      for (let index = 0; index < characters.length; index += 1) {
        const element = characters[index];
        text += element.title && `Nome: ${element.title}\n\n`;
        text += element.category && `Categoria: ${element.category}\n`;
        text += element.gender && `Gênero: ${element.gender}\n`;
        text += element.age && `Idade: ${element.age}\n`;
        text += element.occupation && `Ocupação: ${element.occupation}\n`;
        text += element.date_birth && `Data Nascimento: ${utils.convertDatePTBR(element.date_birth)}\n`;
        text += element.date_death && `Data de morte: ${utils.convertDatePTBR(element.date_death)}\n`;
        text += element.core_group && `Núcleo: ${element.core_group}\n`;
        if (element.relations && element.relations.length > 0) {
          text += 'Relações:\n';
          for (let indexChar = 0; indexChar < element.relations.length; indexChar += 1) {
            const elementChar = element.relations[indexChar];
            const char = characters.filter((ele) => ele.id === elementChar.charID);
            text += `  ${char[0].title}: ${elementChar.type}\n`;
          }
        }
        if (element.link_list && element.link_list.length > 0) {
          text += 'Links:\n';
          for (let indexChar = 0; indexChar < element.link_list.length; indexChar += 1) {
            const elementLink = element.link_list[indexChar];
            text += `  ${elementLink.linkName}: ${elementLink.URL}\n`;
          }
        }
        text += element.physical && `\nCaracterísticas Físicas:\n${element?.physical}\n`;
        text += element.psychological && `\nCaracterísticas Psicológicas:\n${element?.psychological}\n`;
        if (element.task_list && element.task_list.length > 0) {
          text += '\nLista de Tarefas:\n';
          for (let indexTask = 0; indexTask < element.task_list.length; indexTask += 1) {
            const elementTask = element.task_list[indexTask];
            text += `  ${elementTask.task} ${elementTask.isDone ? '- ok' : ''}\n`;
          }
        }
        text += element.resume && `\nResumo:\n${element.resume}\n`;
        text += element.content && `\nConteúdo:\n${element.content}\n`;
        text += exportLabels.labelDivider();
      }
    }
    return text;
  }

  generateWorld(world: IWorld[]): string {
    let text = '';
    text += exportLabels.getMundoLabel();
    if (world) {
      for (let index = 0; index < world.length; index += 1) {
        const element = world[index];
        text += element.title && `Nome: ${element.title}\n\n`;
        text += element.category && `Categoria: ${element.category}\n`;
        text += element.date && `Data: ${utils.convertDatePTBR(element.date)}\n`;
        if (element.link_list && element.link_list.length > 0) {
          text += 'Links:\n';
          for (let indexChar = 0; indexChar < element.link_list.length; indexChar += 1) {
            const elementLink = element.link_list[indexChar];
            text += `  ${elementLink.linkName}: ${elementLink.URL}\n`;
          }
        }
        if (element.task_list && element.task_list.length > 0) {
          text += '\nLista de Tarefas:\n';
          for (let indexTask = 0; indexTask < element.task_list.length; indexTask += 1) {
            const elementTask = element.task_list[indexTask];
            text += `  ${elementTask.task} ${elementTask.isDone ? '- ok' : ''}\n`;
          }
        }
        text += element.resume && `\nResumo:\n${element.resume}\n`;
        text += element.content && `\nConteúdo:\n${element.content}\n`;
        text += exportLabels.labelDivider();
      }
    }
    return text;
  }

  generateNotes(notes: INotes[]): string {
    let text = '';
    text += exportLabels.getNotasLabel();
    if (notes) {
      for (let index = 0; index < notes.length; index += 1) {
        const element = notes[index];
        text += element.title && `Nome: ${element.title}\n\n`;
        text += element.category && `Categoria: ${element.category}\n`;
        if (element.link_list && element.link_list.length > 0) {
          text += 'Links:\n';
          for (let indexChar = 0; indexChar < element.link_list.length; indexChar += 1) {
            const elementLink = element.link_list[indexChar];
            text += `  ${elementLink.linkName}: ${elementLink.URL}\n`;
          }
        }
        if (element.task_list && element.task_list.length > 0) {
          text += '\nLista de Tarefas:\n';
          for (let indexTask = 0; indexTask < element.task_list.length; indexTask += 1) {
            const elementTask = element.task_list[indexTask];
            text += `  ${elementTask.task} ${elementTask.isDone ? '- ok' : ''}\n`;
          }
        }
        text += element.content && `\nConteúdo:\n${element.content}\n`;
        text += exportLabels.labelDivider();
      }
    }
    return text;
  }

  generateManuscript(
    manuscript: IManuscript[],
    characters: ICharacter[],
    world: IWorld[],
  ): string {
    let text = '';
    text += exportLabels.getCenasLabel();
    if (manuscript) {
      for (let index = 0; index < manuscript.length; index += 1) {
        const element = manuscript[index];
        if (element.type === 'Capítulo') {
          text += `Capítulo:\n${element.title}\n\n`;
          text += `Status:\n${element.status}\n\n`;
          text += `Resumo:\n${element.resume}\n\n`;
          text += exportLabels.labelDivider();
        } else {
          text += `Cena:\n${element.title}\n\n`;
          text += element.status && `Status: ${element.status}\n`;
          text += element.pov_id !== 0 && `POV: ${characters?.find((ele) => ele.id === element.pov_id)?.title}\n`;
          text += element.place !== 0 && `Local: ${world?.find((ele) => ele.id === Number(element.place))?.title}\n`;
          text += element.weather && `Tempo: ${element.weather}\n`;
          text += element.goalWC && `Meta de palavras: ${element.goalWC}\n`;
          text += element.date && `Data: ${utils.convertDatePTBR(element.date)}\n`;
          text += element.time && `Hora: ${element.time}\n`;
          if (element.link_list && element.link_list.length > 0) {
            text += 'Links:\n';
            for (let indexChar = 0; indexChar < element.link_list.length; indexChar += 1) {
              const elementLink = element.link_list[indexChar];
              text += `  ${elementLink.linkName}: ${elementLink.URL}\n`;
            }
          }
          if (element.task_list && element.task_list.length > 0) {
            text += '\nLista de Tarefas:\n';
            for (let indexTask = 0; indexTask < element.task_list.length; indexTask += 1) {
              const elementTask = element.task_list[indexTask];
              text += `  ${elementTask.task} ${elementTask.isDone ? '- ok' : ''}\n`;
            }
          }
          text += element.resume && `\nResumo:\n${element.resume}\n`;
          text += element.note && `\nAnotações:\n${element.note}\n`;
          text += element.content && `\nConteúdo:${element.content}\n`;
          text += exportLabels.labelDivider();
        }
      }
    }
    return text;
  }

  generateManuscriptDraft(manuscript: IManuscript[]) {
    let text = '';
    if (manuscript) {
      for (let index = 0; index < manuscript.length; index += 1) {
        const element = manuscript[index];
        if (element.type === 'Capítulo') {
          text += `\n${element.title}\n\n`;
        } else {
          text += `\n${element.title}\n`;
          text += element.content && `${element.content}\n\n\n`;
        }
      }
    }
    return text;
  }

  generateDraftTXT(project: IProject, name: string, time: string) {
    let text = this.generateDraftHeader(project);
    const manuscript: IManuscript[] = project.data?.manuscript || [];
    text += this.generateManuscriptDraft(manuscript);
    text += '*** Fim ***\n\n';
    text += `${time}`;
    const data = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', name);
    link.click();
  }

  async exportDraftTXT() {
    const currentProject = await indexedDBrepository.getCurrentProject();
    if (currentProject) {
      const detatime = utils.getCurrentDateString();
      const nameReult = `${utils.sanitizeFilename(currentProject.title)} ${detatime.toFileName}`;
      this.generateDraftTXT(currentProject, nameReult, detatime.toDraft);
    }
  }

  generateProjectTXT(project: IProject, name: string, time: string) {
    let text = this.generateDraftHeader(project);
    const manuscript: IManuscript[] = project.data?.manuscript || [];
    text += this.generateProjectInfos(project);
    text += this.generateCharacters(project.data?.characters || []);
    text += this.generateWorld(project.data?.world || []);
    text += this.generateNotes(project.data?.notes || []);
    text += this.generateManuscript(
      manuscript,
      project.data?.characters || [],
      project.data?.world || [],
    );

    text += '*** Fim ***\n\n';
    text += `${time}`;
    const data = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', name);
    link.click();
  }

  async exportProjectTXT() {
    const currentProject = await indexedDBrepository.getCurrentProject();
    if (currentProject) {
      const detatime = utils.getCurrentDateString();
      const nameReult = `${utils.sanitizeFilename(currentProject.title)} ${detatime.toFileName}`;
      this.generateProjectTXT(currentProject, nameReult, detatime.toDraft);
    }
  }

  saveAsJSON(objeto: IProject, nomeArquivo: string) {
    const texto = JSON.stringify(objeto);
    const data = new Blob([texto], { type: 'application/json' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', nomeArquivo);
    link.click();
  }

  async exportProject() {
    const project = await indexedDBrepository.getCurrentProject();
    if (project) {
      const detatime = utils.getCurrentDateString();
      const nameReult = utils.sanitizeFilename(project.title);
      const name = `${nameReult} ${detatime.toFileName}`;
      this.saveAsJSON(project, name);
      // updateTimeBackup();
    }
  }
}

const exportService = new ExportService();

export default exportService;
