import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import INotes from '../../../../../interfaces/INotes';
import NewWindowInspect from '../new-window-inspect';

interface CardInspectProps {
  card: INotes;
  isNewWindow: boolean;
}

function NotesInspect({ card, isNewWindow }: CardInspectProps) {
  const navigate = useNavigate();
  const [showNewWindow, setshowNewWindow] = useState(false);

  return (
    <div className="inspectCard">
      {showNewWindow && <NewWindowInspect card={card} />}
      <div className="imageInspect">
        {card.image && (
          <img className="imageInscpet" src={card.image} id="output" alt="notes" />
        )}
      </div>
      <div className="inspectTitle">
        <button onClick={() => navigate(`/notes/${card.id}`)} className="btnInvisible" type="button">{card.title}</button>
        {isNewWindow && (
          <span className="tooltip-default" data-balloon aria-label="Abrir em uma nova janela" data-balloon-pos="down">
            <label className="multiWindowIcon" htmlFor="newWindowIcon">
              <button onClick={() => setshowNewWindow(true)} id="newWindowIcon" className="btnInvisible" type="button">{ }</button>
            </label>
          </span>
        )}
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
