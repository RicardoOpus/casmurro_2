import { useNavigate } from 'react-router-dom';
import IManuscript from '../../../../../domain/IManuscript';

interface CardInspectProps {
  card: IManuscript;
}

function ChapterInspect({ card }: CardInspectProps) {
  const navigate = useNavigate();

  return (
    <div className="inspectCard">
      <div className="inspectTitle">
        <button onClick={() => navigate(`/manuscript/${card.id}`)} className="btnInvisible" type="button">{card.title}</button>
      </div>
      <div className="inspecInfos">
        {card.status ? <span>Status:</span> : ''}
        <p>{card.status}</p>
      </div>
      {card.resume ? <span>Resumo:</span> : ''}
      <p className="PtextInfos">{card.resume}</p>
    </div>
  );
}

export default ChapterInspect;
