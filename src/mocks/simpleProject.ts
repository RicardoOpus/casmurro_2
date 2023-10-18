import Project from "../domain/projectModel";

const simpleProject: Project = {
  title: 'Meu Projeto',
  subtitle: 'Qualquer coisa',
  author: 'Fulano',
  status: 'Em Andamento',
  cards_qty: 10,
  settings: { tipo: 'Alguma configuração'},
  last_edit: 'Última edição',
  timestamp: Date.now(),
  data: { nome: 'isso'},
}

export default simpleProject;
