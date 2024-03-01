/* eslint-disable react/destructuring-assignment */
import { v4 as uuidv4 } from 'uuid';
import IWorld from '../../../../../interfaces/IWorld';
import utils from '../../../../../service/utils';

function RednerWorld(world: IWorld[]) {
  return (
    <div>
      <h2 className="sectionTitle">MUNDO</h2>
      <hr className="dividerPrint" />
      {world.map((e) => (
        <div key={e.id}>
          <h2>{e.title}</h2>
          {e.image && (
            <img className="imageCard" src={e.image} alt="Imagne do item" />
          )}
          {e.category && (
            <h3 className="fontBold">
              Categoria:
              <span>{e.category}</span>
            </h3>
          )}
          {e.date && (
            <h3 className="fontBold">
              Data:
              <span>{utils.convertDatePTBR(e.date)}</span>
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
          {e.resume && (
            <>
              <h3 className="fontBold">Resumo:</h3>
              <h3>{e.resume}</h3>
            </>
          )}
          {e.content && (
            <>
              <h3 className="fontBold">Conteúdo:</h3>
              <h3 dangerouslySetInnerHTML={{ __html: e.content }} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default RednerWorld;
