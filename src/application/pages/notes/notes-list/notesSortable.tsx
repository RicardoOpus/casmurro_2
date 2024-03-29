/* eslint-disable react/jsx-props-no-spreading */
import { useNavigate } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import utils from '../../../../service/utils';

interface Props {
  id: number;
  image: string | undefined;
  title: string;
  category: string | undefined;
  content: string | undefined;
  hasFilter: boolean;
}

function NotesSortable({
  id, image, title, category, content, hasFilter,
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
      <button onClick={() => navigate(`/notes/${id}`)} type="button" className="listItens">
        <div className="listCardWorld">
          {!hasFilter ? (
            <div className="dragHandlerDidabled" />
          ) : (
            <div className="dragHandler" {...attributes} {...listeners}>
              ⣿
            </div>
          )}
          <div style={{ width: '100%' }}>
            <div className="titleCardSection">
              <h3 className="cardListTitle">{title}</h3>
            </div>
            <hr />
            <div className="cardWorldInfos">
              <div>
                <p className="categoryListItem">
                  {category}
                </p>
                <p>{utils.removeHTMLtags(content)}</p>
              </div>
              {image ? (
                <img className="worldListImage" src={image} alt="card img" />
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default NotesSortable;
