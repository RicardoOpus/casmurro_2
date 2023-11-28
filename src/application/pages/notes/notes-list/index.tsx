import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IrootStateProject from '../../../../domain/IrootStateProject';
import INotes from '../../../../domain/InotesModel';
import NoData from '../../../components/no-dada';
import NotFound from '../../not-found';
import utils from '../../../../service/utils';

// type RootStateWorld = {
//   worldFilterReducer: {
//     selectedTitle: string,
//     selectedCategory: string,
//     isAscOrder: boolean,
//   }
// };

function NotesList() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  // const prjSettings = useSelector((state: IrootStateProject) => (
  //   state.projectDataReducer.projectData.projectSettings));
  const [NotesItens, setNotesItens] = useState<INotes[]>([]);
  const [filtredNotesItens, setfiltredNotesItens] = useState<INotes[]>([]);
  // const [, setClearFilters] = useState(false);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const {
  //   selectedTitle,
  //   selectedCategory,
  //   isAscOrder,
  // } = useSelector((state: RootStateWorld) => state.worldFilterReducer);

  useEffect(() => {
    if (projectData.data?.notes) {
      setNotesItens(projectData.data.notes);
      setfiltredNotesItens(projectData.data.notes);
    }
  }, [projectData.data?.notes]);

  return (
    NotesItens.length === 0 ? (
      <NoData dataType="notas" />
    ) : (
      <div>
        {filtredNotesItens.length === 0 ? (
          <NotFound />
        ) : (
          filtredNotesItens.map((noteItem) => (
            <button onClick={() => navigate(`/notes/${noteItem.id}`)} key={noteItem.id} type="button" className="listItens">
              <div className="listCardWorld">
                <h3 className="cardListTitle">{noteItem.title}</h3>
                <hr />
                <div className="cardWorldInfos">
                  <div>
                    <p className="categoryListItem">
                      {noteItem.category}
                    </p>
                    <p>{utils.abreviarString(noteItem.content, 300)}</p>
                  </div>
                  {noteItem.image ? (
                    <img className="worldListImage" src={noteItem.image} alt="card img" />
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    )
  );
}

export default NotesList;
