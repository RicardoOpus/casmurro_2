import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import IManuscript from '../../../../../domain/IManuscript';
import manuscriptService from '../../../../../service/manuscriptService';
import { fetchProjectDataAction } from '../../../../redux/actions/projectActions';

interface CardInspectProps {
  card: IManuscript;
}

function ChapterInspect({ card }: CardInspectProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = async () => {
    await manuscriptService.updateCurrent(card.id);
    dispatch(fetchProjectDataAction(true));
    navigate(`/manuscript/${card.id}`);
  };

  return (
    <div className="inspectCard">
      <div className="inspectTitle">
        <button onClick={handleClick} className="btnInvisible" type="button">{card.title}</button>
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
