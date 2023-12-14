import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IrootStateProject from '../../../../iterfaces/IRootStateProject';
import INotes from '../../../../iterfaces/INotes';
import NoData from '../../../components/no-dada';
import NotFound from '../../../components/not-found';
import utils from '../../../../service/utils';
import { notesFilterCategoryAction, notesFilterSortAction, notesFilterTitleAction } from '../../../redux/actions/notesActions';

type RootStateWorld = {
  notesFilterReducer: {
    selectedTitle: string,
    selectedCategory: string,
    isAscOrder: boolean,
  }
};

function NotesList() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [NotesItens, setNotesItens] = useState<INotes[]>([]);
  const [filtredNotesItens, setfiltredNotesItens] = useState<INotes[]>([]);
  const [, setClearFilters] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    selectedTitle,
    selectedCategory,
    isAscOrder,
  } = useSelector((state: RootStateWorld) => state.notesFilterReducer);

  const clearAllFilters = () => {
    dispatch(notesFilterTitleAction(''));
    dispatch(notesFilterCategoryAction(''));
    setClearFilters(true);
  };

  const handleSort = () => {
    const sortedList = [...filtredNotesItens].reverse();
    setfiltredNotesItens(sortedList);
    dispatch(notesFilterSortAction(!isAscOrder));
  };

  useEffect(() => {
    if (projectData.data?.notes) {
      setNotesItens(projectData.data.notes);
      setfiltredNotesItens(projectData.data.notes);
    }
  }, [projectData.data?.notes]);

  useEffect(() => {
    const handleFilter = (notesList: INotes[]) => {
      const result = notesList.filter((note) => {
        const titleMatch = !selectedTitle || note.title.includes(selectedTitle);
        const categoryMatch = !selectedCategory || note.category === selectedCategory;
        return titleMatch && categoryMatch;
      });
      if (!isAscOrder) {
        const sortedList = [...result].reverse();
        setfiltredNotesItens(sortedList);
        dispatch(notesFilterSortAction(isAscOrder));
      } else {
        setfiltredNotesItens(result);
      }
    };
    handleFilter(NotesItens);
  }, [NotesItens,
    selectedTitle, selectedCategory, isAscOrder, dispatch]);

  return (
    NotesItens.length === 0 ? (
      <NoData dataType="notas" />
    ) : (
      <div>
        <div className="filterBar">
          <input
            type="text"
            value={selectedTitle}
            placeholder="Pesquisar pelo título..."
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              dispatch(notesFilterTitleAction(target.value));
            }}
            className="cardInputSearch"
          />
          <select
            value={selectedCategory}
            onChange={(e) => dispatch(notesFilterCategoryAction(e.target.value))}
            style={{ color: 'var(--text-color-inactive)' }}
          >
            <option value="">Categoria</option>
            {prjSettings.notesCategory.map((e) => (
              <option key={e} value={e}>{`• ${e}`}</option>
            ))}
          </select>
          <button className="btnSmall" type="button" onClick={clearAllFilters}>✖ Filtros</button>
          <button className="btnSmall" type="button" onClick={handleSort} disabled={isAscOrder}>↑ Az</button>
          <button className="btnSmall" type="button" onClick={handleSort} disabled={!isAscOrder}>↓ Za</button>
        </div>
        <div className="amountInfoBar">
          <h3>
            Total
            {' '}
            {filtredNotesItens.length}
          </h3>
        </div>
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
