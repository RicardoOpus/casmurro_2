import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import IWorld from '../../../../../iterfaces/IWorld';
import utils from '../../../../../service/utils';

interface CardInspectProps {
  card: IWorld;
}

function WorldInspect({ card }: CardInspectProps) {
  const navigate = useNavigate();

  return (
    <div className="inspectCard">
      <div className="imageInspect">
        {card.image && (
          <img className="imageInscpet" src={card.image} id="output" alt="character" />
        )}
      </div>
      <div className="inspectTitle">
        <button onClick={() => navigate(`/world/${card.id}`)} className="btnInvisible" type="button">{card.title}</button>
      </div>
      <div className="inspecInfos">
        {card.category ? <span>Categoria:</span> : ''}
        <p>{card.category}</p>
        {card.date ? <span>Data:</span> : ''}
        <p>{utils.convertDatePTBR(card.date)}</p>
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
      {card.resume ? <span>Resumo:</span> : ''}
      <p className="PtextInfos">{card.resume}</p>
      {card.note ? <span>Notas:</span> : ''}
      <p className="PtextInfos">{card.note}</p>
      {card.content ? <span>Conteúdo:</span> : ''}
      <p className="PtextInfos">{card.content}</p>
    </div>
  );
}

export default WorldInspect;
