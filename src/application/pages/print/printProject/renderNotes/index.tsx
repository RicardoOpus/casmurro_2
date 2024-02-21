/* eslint-disable react/destructuring-assignment */
import { v4 as uuidv4 } from 'uuid';
import INotes from '../../../../../interfaces/INotes';

function RednerNotes(note: INotes[]) {
  return (
    <div>
      <h2 className="sectionTitle">NOTAS</h2>
      <hr className="dividerPrint" />
      {note.map((e) => (
        <div key={e.id}>
          <h2>{e.title}</h2>
          {e.image && (
            <img className="imageCard" src={e.image} alt="Imagne do item" />
          )}
          {e.category && (
            <h3 className="fontBold">
              Categoria:
              {' '}
              <span>{e.category}</span>
            </h3>
          )}
          {e.task_list && e.task_list.length > 0 && (
            <>
              <h3 className="fontBold">Lista de Tarefas:</h3>
              {e.task_list.map((item) => (
                <li key={uuidv4()} style={{ textDecoration: item.isDone ? 'line-through' : '' }}>{item.task}</li>
              ))}
            </>
          )}
          {e.content && (
            <>
              <h3 className="fontBold">Conteúdo:</h3>
              <h3>{e.content}</h3>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default RednerNotes;
