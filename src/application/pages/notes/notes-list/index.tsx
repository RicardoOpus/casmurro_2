import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import INotes from '../../../../interfaces/INotes';
import NoData from '../../../components/no-dada';
import NotFound from '../../../components/not-found';
import {
  notesFilterCategoryAction,
  notesFilterTitleAction,
  notesFilterSortAction,
  notesFilterSortActionDirection,
} from '../../../redux/actions/notesActions';
import notesService from '../../../../service/notesService';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import NotesSortable from './notesSortable';

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
  const [positionChagne, setPositionChange] = useState(false);
  const [isFilterClear, setisFilterClear] = useState(true);
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
      const selectedTitleLower = selectedTitle ? selectedTitle.toLowerCase() : '';

      const result = notesList.filter((note) => {
        const titleMatch = !selectedTitleLower
          || note.title.toLowerCase().includes(selectedTitleLower);
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

  const changePosition = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const activeIndex = filtredNotesItens.findIndex((item) => item.id === active.id);
      const overIndex = filtredNotesItens.findIndex((item) => item.id === over.id);
      if (activeIndex !== -1 && overIndex !== -1 && active.id !== over.id) {
        setNotesItens((items) => {
          const newItems = arrayMove(items, activeIndex, overIndex);
          return [...newItems];
        });
        setPositionChange(true);
      }
    }
  };

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupFunction, []);

  useEffect(() => {
    if (positionChagne) {
      notesService.upDatePosition(NotesItens);
      setPositionChange(false);
    }
  }, [NotesItens, dispatch, positionChagne]);

  return (
    NotesItens.length === 0 ? (
      <NoData dataType="notas" />
    ) : (
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={changePosition}
        modifiers={[restrictToVerticalAxis]}
      >
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
          <SortableContext
            items={filtredNotesItens}
            strategy={verticalListSortingStrategy}
          >
            {
              filtredNotesItens.map((note) => (
                <NotesSortable
                  id={note.id}
                  title={note.title}
                  image={note.image}
                  category={note.category}
                  content={note.content}
                  hasFilter={isFilterClear}
                />
              ))
            }
          </SortableContext>
        )}
      </DndContext>
    )
  );
}

export default NotesList;
