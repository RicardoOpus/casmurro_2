import Project from '../domain/projectModel';
import db from '../infra/database/dexieDB'
import fullProject from './fulProject';

function DevScripts() {
  const deleteDB = () => {
    db.delete().then(() => {
      console.log("Database successfully deleted");
    }).catch(() => {
      console.error("Could not delete database");
    })
  }

  const populeDB = () => {
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
    };

    db.projects.add(simpleProject).then(() => {
      console.log('Projeto adicionado com sucesso!');
    });
  }

  function populeFullDB() {
    const data = fullProject;

    db.projects.add(data).then(() => {
      console.log('Projeto adicionado com sucesso!');
    });
  }

  return (
    <div>
      <h2>Rotinas dev</h2>
      <div>
        <button onClick={deleteDB}>Deletar DB</button>
        <button onClick={populeDB}>Popular DB Simple</button>
        <button onClick={populeFullDB}>Popular DB Full</button>
      </div>
    </div>
  )
}

export default DevScripts;
