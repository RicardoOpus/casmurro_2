/* eslint-disable class-methods-use-this */
import IManuscript from '../domain/IManuscript';
import IProject from '../domain/projectModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';
import utils from './utils';

class ExportService {
  generateDraftTXTheader(project: IProject) {
    let text = '';
    text += `Título:\n${project.title}\n\n`;
    if (project.subtitle) {
      text += `Subtítulo:\n${project.subtitle}\n\n`;
    } if (project.author) {
      text += `Autor:\n${project.author}\n\n`;
    }
    return text;
  }

  generateDraftTXT(project: IProject, name: string, time: string) {
    let text = this.generateDraftTXTheader(project);
    const manuscript: IManuscript[] = project.data?.manuscript || [];
    if (manuscript) {
      for (let index = 0; index < manuscript.length; index += 1) {
        const element = manuscript[index];
        if (element.type === 'Capítulo') {
          text += `\n${element.title}\n\n`;
        } else {
          text += `${element.title}\n${element.content}\n\n`;
        }
      }
    }
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
}

const exportService = new ExportService();

export default exportService;
