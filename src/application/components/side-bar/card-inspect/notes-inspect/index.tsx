import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import INotes from '../../../../../iterfaces/InotesModel';

interface CardInspectProps {
  card: INotes;
}

function NotesInspect({ card }: CardInspectProps) {
  const navigate = useNavigate();

  return (
    <div className="inspectCard">
      <div className="imageInspect">
        {card.image && (
          <img className="imageInscpet" src={card.image} id="output" alt="notes" />
        )}
      </div>
      <div className="inspectTitle">
        <button onClick={() => navigate(`/notes/${card.id}`)} className="btnInvisible" type="button">{card.title}</button>
      </div>
      <div className="inspecInfos">
        {card.category ? <span>Categoria:</span> : ''}
        <p>{card.category}</p>
      </div>
      <div className="inspectCharRelations">
        {card.link_list && card.link_list.length > 0 ? <span>Links:</span> : ''}
        {card.link_list?.map((e) => (
          <div key={uuidv4()}>
            <a href={e.URL} target="_blank" rel="noreferrer">{e.linkName}</a>
          </div>
        ))}
      </div>
      <div className="inspectCharRelations">
        {card.task_list && card.task_list.length > 0 ? <span>Tarefas:</span> : ''}
        {card.task_list?.map((e) => (
          <div key={uuidv4()}>
            <p className={e.isDone ? 'doneTask spanTaskLit' : 'spanTaskLit'}>{`• ${e.task}`}</p>
          </div>
        ))}
      </div>
      {card.content ? <span>Conteúdo:</span> : ''}
      <p className="PtextInfos">{card.content}</p>
    </div>
  );
}

export default NotesInspect;
