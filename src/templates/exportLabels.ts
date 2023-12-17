/* eslint-disable class-methods-use-this */
class ExportLabels {
  getResumeLabel() {
    return `
                  ╔═════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║  RESUMO DO PROJETO  ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚═════════════════════╝
`;
  }

  getPersonagensLabel() {
    return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║      PERSONAGENS       ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝
`;
  }

  getMundoLabel() {
    return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║         MUNDO          ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝
`;
  }

  getCenasLabel() {
    return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║       MANUSCRITO       ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝
`;
  }

  getTimelineLabelLabel() {
    return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║        TIMELINE        ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝
`;
  }

  getNotasLabel() {
    return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║         NOTAS          ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝
`;
  }

  labelDivider() {
    return '\n──────────────────────────────────────────────────────────────\n\n';
  }
}

const exportLabels = new ExportLabels();

export default exportLabels;
