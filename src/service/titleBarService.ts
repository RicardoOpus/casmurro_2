import utils from './utils';

class TitleBarService {
  maxHoursToWarning = 2;

  maxDaysToWarning = 1;

  maxLenghtTitle = 30;

  backupMensage(lastBackup: number | undefined): string {
    if (!lastBackup) {
      return '';
    }
    const now = new Date().getTime();
    const diferenca = now - lastBackup;
    const msEmUmDia = 86400000;
    const dias = Math.floor(diferenca / msEmUmDia);
    const horas = Math.floor((diferenca % msEmUmDia) / 3600000);
    if (lastBackup === 0) {
      return '';
    }
    if (horas < this.maxHoursToWarning && dias < this.maxDaysToWarning) {
      return '';
    } if (dias === 1) {
      return `${dias} dia e ${horas} horas desde o último backup!`;
    }
    return `${dias === 0 ? '' : `${dias} dias e `} ${horas} horas desde o último backup!`;
  }

  titleReduction(str: string) {
    const titleCut = utils.abreviarString(str, this.maxLenghtTitle);
    return titleCut;
  }
}

const titleBarService = new TitleBarService();

export default titleBarService;
