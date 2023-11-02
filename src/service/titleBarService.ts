class TitleBarService {
  // eslint-disable-next-line class-methods-use-this
  backupMensage(lastBackup: number | undefined): string {
    if (!lastBackup) {
      return '';
    }
    const now = new Date();
    const diferenca = now - lastBackup;
    const msEmUmDia = 86400000;
    const dias = Math.floor(diferenca / msEmUmDia);
    const horas = Math.floor((diferenca % msEmUmDia) / 3600000);
    if (lastBackup === 0) {
      return '';
    }
    if (horas < 2 && dias < 1) {
      return '';
    } if (dias === 1) {
      return `${dias} dia e ${horas} horas desde o último backup!`;
    }
    return `${dias === 0 ? '' : `${dias} dias e `} ${horas} horas desde o último backup!`;
  }
}

export default TitleBarService;
