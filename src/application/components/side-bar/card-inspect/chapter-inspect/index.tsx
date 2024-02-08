import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import IManuscript from '../../../../../interfaces/IManuscript';
import manuscriptService from '../../../../../service/manuscriptService';
import { fetchProjectDataAction } from '../../../../redux/actions/projectActions';
import NewWindowInspect from '../new-window-inspect';

interface CardInspectProps {
  card: IManuscript;
  isNewWindow: boolean;
}

function ChapterInspect({ card, isNewWindow }: CardInspectProps) {
  const [showNewWindow, setshowNewWindow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = async () => {
    await manuscriptService.updateCurrent(card.id);
    dispatch(fetchProjectDataAction(true));
    navigate(`/manuscript/${card.id}`);
  };

  return (
    <div className="inspectCard">
      {showNewWindow && <NewWindowInspect card={card} />}
      <div className="inspectTitle">
        <button onClick={handleClick} className="btnInvisible" type="button">{card.title || 'sem nome'}</button>
        {isNewWindow && (
          <span className="tooltip-default" data-balloon aria-label="Abrir em uma nova janela" data-balloon-pos="down">
            <label className="multiWindowIcon" htmlFor="newWindowIcon">
              <button onClick={() => setshowNewWindow(true)} id="newWindowIcon" className="btnInvisible" type="button">{ }</button>
            </label>
          </span>
        )}
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
