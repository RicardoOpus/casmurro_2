/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
import utils from '../../../../service/utils';
import ICharacter from '../../../../interfaces/ICharacter';

interface Props {
  id: number;
  current: boolean | undefined;
  manuscriptShowPovColor: boolean;
  charList: ICharacter[] | undefined;
  povId: number | undefined;
  type: string;
  title: string;
  manuscriptShowWC: boolean;
  content: string | undefined;
  manuscriptShowChecks: boolean;
  status: string | undefined;
  manuscriptShowSynopsis: boolean;
  resume: string | undefined;
  handleClick: (item: number) => void;
  handleDoubleClick: (item: number) => void;
  deleteCene: (id: number) => void;
  hasFilter: boolean;
}

function SortableScenes({
  id,
  current,
  manuscriptShowPovColor,
  charList,
  povId,
  type,
  title,
  manuscriptShowWC,
  content,
  manuscriptShowChecks,
  status,
  manuscriptShowSynopsis,
  resume,
  handleClick,
  handleDoubleClick,
  deleteCene,
  hasFilter,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderChecks = (typeStatus: string | undefined) => {
    switch (typeStatus) {
      case 'Pronto':
        return (
          <span className="checkSceneList" style={{ color: 'var(--green-color)' }}>
            ✔
          </span>
        );
      case 'Revisado':
        return (
          <span className="checkSceneList" style={{ color: 'var(--green-color)' }}>
            ✔✔
          </span>
        );
      default:
        return (
          <div>
            <span />
          </div>
        );
    }
  };

  const renderBtns = (idTodelete: number) => (
    <span>
      <button onClick={() => deleteCene(idTodelete)} className="btnInvisibleDel" type="button">X</button>
    </span>
  );

  return (
    <div ref={setNodeRef} style={style} className={type === 'Cena' ? '' : 'chapter'}>
      <button onClick={() => handleClick(id)} onDoubleClick={() => handleDoubleClick(id)} key={id} className={current ? 'selected' : 'btnScene'} type="button">
        <div className="itemDraft">
          <div className="innerBtnScene">
            {!hasFilter ? (
              <div className="dragHandlerDidabled" />
            ) : (
              <div className="dragHandler2" {...attributes} {...listeners}>
                ⣿
              </div>
            )}
            {manuscriptShowPovColor && (
              charList?.map((e) => e.id === povId && (
                <span key={uuidv4()} className="charTagIcon" style={{ backgroundColor: e.color }} />
              ))
            )}
            <div className={type === 'Cena' ? 'textIcon' : 'folderIcon'} />
            <p style={{ color: current ? '#000000de' : '', fontFamily: 'sans-serif', fontWeight: 'bolder' }}>
              {title || 'sem nome'}
            </p>
            {manuscriptShowWC && type === 'Cena' && (
              <span
                className="wordCountSpan"
                style={{ color: current ? '#000000de' : '', marginLeft: '.5em' }}
              >
                {`(${utils.countWords(content).toLocaleString()})`}
              </span>
            )}
            {manuscriptShowChecks && (
              renderChecks(status)
            )}
            {current && renderBtns(id)}
          </div>
          {manuscriptShowSynopsis && (
            <p
              style={{ color: current ? '#000000de' : 'var(--text-color-inactive)', marginLeft: '2.5em' }}
            >
              {resume}
            </p>
          )}
        </div>
      </button>
    </div>
  );
}

export default SortableScenes;
