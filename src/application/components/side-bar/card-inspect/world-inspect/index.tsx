import { useNavigate } from 'react-router-dom';
import IWorld from '../../../../../domain/worldModel';

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
