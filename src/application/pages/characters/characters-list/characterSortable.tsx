/* eslint-disable react/jsx-props-no-spreading */
import { useNavigate } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import utils from '../../../../service/utils';

interface Props {
  id: number;
  image: string | undefined;
  color: string | undefined;
  title: string;
  category: string | undefined;
  age: string | undefined;
  resume: string | undefined;
  hasFilter: boolean;
}

function CharacterSorteble({
  id, image, color, title, category, age, resume, hasFilter,
}: Props) {
  const navigate = useNavigate();
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

  return (
    <div ref={setNodeRef} style={style}>
      <button onClick={() => navigate(`/characters/${id}`)} type="button" className="listItens">
        <div className="listCard">
          {!hasFilter ? (
            <div className="dragHandlerDidabled" />
          ) : (
            <div className="dragHandler" {...attributes} {...listeners}>
              ⣿
            </div>
          )}
          {image ? (
            <img className="charListImage" src={image} alt="person img" />
          ) : (
            <img className="charListImage" src="./images/person.png" alt="person img" />
          )}
          <div style={{ width: '100%', margin: '0.5em 0' }}>
            <div className="titleCardSection">
              <h3 className="cardListTitle">
                <span className="charTagIcon" style={{ backgroundColor: `${color || 'var(--text-color-sec)'}` }} />
                {title}
              </h3>
            </div>
            <p className="categoryListItem">
              {category}
              {' '}
              {age ? `• ${age} anos` : ''}
            </p>
            <p>{utils.abreviarString(resume, 300)}</p>
          </div>
        </div>
      </button>
    </div>
  );
}

export default CharacterSorteble;
