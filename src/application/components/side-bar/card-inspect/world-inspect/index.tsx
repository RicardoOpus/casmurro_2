import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import IWorld from '../../../../../interfaces/IWorld';
import utils from '../../../../../service/utils';
import NewWindowInspect from '../new-window-inspect';

interface CardInspectProps {
  card: IWorld;
  isNewWindow: boolean;
}

function WorldInspect({ card, isNewWindow }: CardInspectProps) {
  const navigate = useNavigate();
  const [showNewWindow, setshowNewWindow] = useState(false);

  return (
    <div className="inspectCard">
      {showNewWindow && <NewWindowInspect card={card} />}
      <div className="imageInspect">
        {card.image && (
          <img className="imageInscpet" src={card.image} id="output" alt="character" />
        )}
      </div>
      <div className="inspectTitle">
        <button onClick={() => navigate(`/world/${card.id}`)} className="btnInvisible" type="button">{card.title}</button>
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
        {card.date ? <span>Data:</span> : ''}
        <p>{utils.convertDatePTBR(card.date)}</p>
      </div>
      <div className="inspectCharRelations">
        {card.task_list && card.task_list.length > 0 ? <span>Tarefas:</span> : ''}
        {card.task_list?.map((e) => (
          <div key={uuidv4()}>
            <p className={e.isDone ? 'doneTask spanTaskLit' : 'spanTaskLit'}>{`• ${e.task}`}</p>
          </div>
        ))}
      </div>
      {card.resume ? <span>Resumo:</span> : ''}
      <p className="PtextInfos">{card.resume}</p>
      {card.content ? <span>Conteúdo:</span> : ''}
      {card.content && (
        <div dangerouslySetInnerHTML={{ __html: card.content }} />
      )}
    </div>
  );
}

export default WorldInspect;
