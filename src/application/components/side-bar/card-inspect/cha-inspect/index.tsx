import { useNavigate } from 'react-router-dom';
import ICharacter from '../../../../../domain/characterModel';

interface CardInspectProps {
  card: ICharacter;
}

function CharInspect({ card }: CardInspectProps) {
  const navigate = useNavigate();

  return (
    <div className="inspectCard">
      <div className="imageInspect">
        {card.image && (
          <img className="picInscpet" src={card.image} id="output" alt="character" />
        )}
      </div>
      <div className="inspectTitle">
        <div className="circulo" style={{ backgroundColor: card.color }} />
        <button onClick={() => navigate(`/characters/${card.id}`)} className="btnInvisible" type="button">{card.title}</button>
      </div>
      <div className="inspecInfos">
        {card.age ? <span>Idade:</span> : ''}
        <p>{card.age ? `${card.age} anos` : ''}</p>
        {card.gender ? <span>Gênero:</span> : ''}
        <p>{card.gender}</p>
        {card.category ? <span>Categoria:</span> : ''}
        <p>{card.category}</p>
        {card.occupation ? <span>Ocupação:</span> : ''}
        <p>{card.occupation}</p>
        {card.core_group ? <span>Núcleo:</span> : ''}
        <p>{card.core_group}</p>
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

export default CharInspect;
