import { useDispatch, useSelector } from 'react-redux';
import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import INotes from '../../../../interfaces/INotes';
import NoData from '../../../components/no-dada';
import NotFound from '../../../components/not-found';
import utils from '../../../../service/utils';
import {
  notesFilterCategoryAction,
  notesFilterTitleAction,
  notesFilterSortAction,
  notesFilterSortActionDirection,
} from '../../../redux/actions/notesActions';
import notesService from '../../../../service/notesService';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';

type RootStateWorld = {
  notesFilterReducer: {
    selectedTitle: string,
    selectedCategory: string,
    isOrder: boolean,
    isAscOrder: boolean,
  }
};

function NotesList() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [NotesItens, setNotesItens] = useState<INotes[]>([]);
  const [filtredNotesItens, setfiltredNotesItens] = useState<INotes[]>([]);
  const [isFilterClear, setisFilterClear] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    selectedTitle,
    selectedCategory,
    isOrder,
    isAscOrder,
  } = useSelector((state: RootStateWorld) => state.notesFilterReducer);

  const clearAllFilters = () => {
    dispatch(notesFilterTitleAction(''));
    dispatch(notesFilterCategoryAction(''));
    dispatch(notesFilterSortAction(false));
    setisFilterClear(true);
  };

  const handleSort = (direction: boolean) => {
    if (direction) {
      dispatch(notesFilterSortActionDirection(true));
    } else {
      dispatch(notesFilterSortActionDirection(false));
    }
    dispatch(notesFilterSortAction(true));
  };

  useEffect(() => {
    if (projectData.data?.notes) {
      setNotesItens(projectData.data.notes);
      setfiltredNotesItens(projectData.data.notes);
    }
  }, [projectData.data?.notes]);

  useEffect(() => {
    if (selectedTitle
      || selectedCategory
      || isOrder) {
      setisFilterClear(false);
    }
  }, [isOrder, selectedCategory, selectedTitle]);

  useEffect(() => {
    const handleFilter = (notesList: INotes[]) => {
      const result = notesList.filter((note) => {
        const titleMatch = !selectedTitle || note.title.includes(selectedTitle);
        const categoryMatch = !selectedCategory || note.category === selectedCategory;
        return titleMatch && categoryMatch;
      });
      if (isOrder) {
        if (isAscOrder) {
          const sortedList = result.sort((a, b) => a.title.localeCompare(b.title));
          setfiltredNotesItens(sortedList);
        } else {
          const sortedList = result.sort((a, b) => a.title.localeCompare(b.title)).reverse();
          setfiltredNotesItens(sortedList);
        }
      } else {
        setfiltredNotesItens(result);
      }
    };
    handleFilter(NotesItens);
  }, [NotesItens, selectedTitle, selectedCategory, isAscOrder, dispatch, isOrder]);

  const changePosition = async (
    e: MouseEvent<HTMLButtonElement>,
    list: INotes[],
    toUp: boolean,
    id: number,
  ) => {
    e.stopPropagation();
    const currentTask = list?.map((ele) => ele.id);
    const selectedI = currentTask?.indexOf(id) ?? -1;
    if (toUp && selectedI > 0 && list) {
      const newI = list;
      const swapIndex = selectedI - 1;
      [newI[swapIndex], newI[selectedI]] = [newI[selectedI], newI[swapIndex]];
      await notesService.upDatePosition(newI);
      dispatch(fetchProjectDataAction(true));
    } else if (!toUp && list && selectedI < list.length - 1) {
      const newI = list;
      const swapIndex = selectedI + 1;
      [newI[swapIndex], newI[selectedI]] = [newI[selectedI], newI[swapIndex]];
      await notesService.upDatePosition(newI);
      dispatch(fetchProjectDataAction(true));
    }
  };

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
          <button className="btnSmall" type="button" onClick={() => handleSort(true)}>↑ Az</button>
          <button className="btnSmall" type="button" onClick={() => handleSort(false)}>↓ Za</button>
          <button className="btnSmall" type="button" onClick={clearAllFilters} disabled={isFilterClear}>✖ Filtros</button>
        </div>
        <div className="amountInfoBar">
          <h3>
            Total
            {' '}
            {filtredNotesItens.length}
            {' '}
            {!isFilterClear && <span>- Filtros aplicados</span>}
          </h3>
        </div>
        {filtredNotesItens.length === 0 ? (
          <NotFound />
        ) : (
          filtredNotesItens.map((noteItem) => (
            <button onClick={() => navigate(`/notes/${noteItem.id}`)} key={noteItem.id} type="button" className="listItens">
              <div className="listCardWorld">
                <div className="titleCardSection">
                  <h3 className="cardListTitle">{noteItem.title}</h3>
                  {isFilterClear && (
                    <div style={{ display: 'flex', gap: '0.5em' }}>
                      <button onClick={(e) => changePosition(e, NotesItens, true, noteItem.id)} className="btnSmall deleteButton" type="button">▲</button>
                      <button onClick={(e) => changePosition(e, NotesItens, false, noteItem.id)} className="btnSmall deleteButton" type="button">▼</button>
                    </div>
                  )}
                </div>
                <hr />
                <div className="cardWorldInfos">
                  <div>
                    <p className="categoryListItem">
                      {noteItem.category}
                    </p>
                    {/* <p>{utils.abreviarString(noteItem.content, 300)}</p> */}
                    <p>{utils.removeHTMLtags(noteItem.content)}</p>
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
