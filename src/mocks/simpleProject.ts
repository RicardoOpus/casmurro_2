import Project from '../domain/projectModel';

const simpleProject: Project = {
  title: 'A Coisa',
  subtitle: 'Qualquer coisa',
  author: 'Fulano',
  status: 'Finalizado',
  cards_qty: 10,
  lastBackup: 0,
  projectSettings: { tipo: 'Alguma configuração' },
  last_edit: Date.now(),
  created_at: Date.now(),
  data: { nome: 'isso' },
  literary_genre: 'Romance',
  id_controler: 0,
};

export default simpleProject;
