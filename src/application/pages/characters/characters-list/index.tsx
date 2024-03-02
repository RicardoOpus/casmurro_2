import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import ICharacter from '../../../../interfaces/ICharacter';
import './characters-list.css';
import {
  charFilterTitleAction,
  charFilterCategoryAction,
  charFilterGenderAction,
  charFilterCoreGroupAction,
  charFilterSortAction,
  charFilterSortActionDirection,
} from '../../../redux/actions/characterActions';
import NotFound from '../../../components/not-found';
import NoData from '../../../components/no-dada';
import characterService from '../../../../service/characterService';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import CharacterSorteble from './characterSortable';

type RootStateChar = {
  charFilterReducer: {
    selectedTitle: string,
    selectedCategory: string,
    selectedGender: string,
    selectedCoreGroup: string,
    isOrder: boolean,
    isAscOrder: boolean,
  }
};

function CharactersList() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [positionChagne, setPositionChange] = useState(false);
  const [isFilterClear, setisFilterClear] = useState(true);
  const {
    selectedTitle,
    selectedCategory,
    selectedGender,
    selectedCoreGroup,
    isOrder,
    isAscOrder,
  } = useSelector((state: RootStateChar) => state.charFilterReducer);
  const dispatch = useDispatch();

  const [filtredCharacters, setFiltredCharacters] = useState<ICharacter[]>([]);

  useEffect(() => {
    if (projectData.data?.characters) {
      setCharacters(projectData.data.characters);
      setFiltredCharacters(projectData.data.characters);
    }
  }, [projectData.data?.characters]);

  const clearAllFilters = () => {
    dispatch(charFilterTitleAction(''));
    dispatch(charFilterCategoryAction(''));
    dispatch(charFilterGenderAction(''));
    dispatch(charFilterCoreGroupAction(''));
    dispatch(charFilterSortAction(false));
    setisFilterClear(true);
  };

  useEffect(() => {
    if (selectedTitle
      || selectedCategory
      || selectedGender
      || selectedCoreGroup
      || isOrder) {
      setisFilterClear(false);
    }
  }, [isOrder, selectedCategory, selectedCoreGroup, selectedGender, selectedTitle]);

  useEffect(() => {
    const handleFilter = (charactersList: ICharacter[]) => {
      const selectedTitleLower = selectedTitle ? selectedTitle.toLowerCase() : '';
      const result = charactersList.filter((character) => {
        const titleMatch = !selectedTitleLower
          || character.title.toLowerCase().includes(selectedTitleLower);
        const categoryMatch = !selectedCategory || character.category === selectedCategory;
        const genderMatch = !selectedGender || character.gender === selectedGender;
        const coreGroupMatch = !selectedCoreGroup || character.core_group === selectedCoreGroup;
        return titleMatch && categoryMatch && genderMatch && coreGroupMatch;
      });
      if (isOrder) {
        if (isAscOrder) {
          const sortedList = result.sort((a, b) => a.title.localeCompare(b.title));
          setFiltredCharacters(sortedList);
        } else {
          const sortedList = result.sort((a, b) => a.title.localeCompare(b.title)).reverse();
          setFiltredCharacters(sortedList);
        }
      } else {
        setFiltredCharacters(result);
      }
    };
    handleFilter(characters);
  }, [characters, selectedTitle,
    selectedCategory, selectedGender, selectedCoreGroup, isAscOrder, dispatch, isOrder]);

  const handleSort = (direction: boolean) => {
    if (direction) {
      dispatch(charFilterSortActionDirection(true));
    } else {
      dispatch(charFilterSortActionDirection(false));
    }
    dispatch(charFilterSortAction(true));
  };

  const changePosition = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const activeIndex = filtredCharacters.findIndex((character) => character.id === active.id);
      const overIndex = filtredCharacters.findIndex((character) => character.id === over.id);
      if (activeIndex !== -1 && overIndex !== -1 && active.id !== over.id) {
        setCharacters((items) => {
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
      characterService.upDatePosition(characters);
      setPositionChange(false);
    }
  }, [characters, dispatch, positionChagne]);

  return (
    characters.length === 0 ? (
      <NoData dataType="personagens" />
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
              dispatch(charFilterTitleAction(target.value));
            }}
            className="cardInputSearch"
          />
          <select
            value={selectedCategory}
            onChange={(e) => dispatch(charFilterCategoryAction(e.target.value))}
            style={{ color: 'var(--text-color-inactive)' }}
          >
            <option value="">Categoria</option>
            {prjSettings.charactersCategory.map((e) => (
              <option key={e} value={e}>
                {' '}
                •
                {' '}
                {e}
              </option>
            ))}
          </select>
          <select
            value={selectedGender}
            onChange={(e) => dispatch(charFilterGenderAction(e.target.value))}
            style={{ color: 'var(--text-color-inactive)' }}
          >
            <option value="">Gênero</option>
            {prjSettings.charactersGenders.map((e) => (
              <option key={e} value={e}>
                {' '}
                •
                {' '}
                {e}
              </option>
            ))}
          </select>
          <select
            value={selectedCoreGroup}
            onChange={(e) => dispatch(charFilterCoreGroupAction(e.target.value))}
            style={{ color: 'var(--text-color-inactive)' }}
          >
            <option value="">Núcleo</option>
            {prjSettings.charactersCoreGroupes.map((e) => (
              <option key={e} value={e}>
                {' '}
                •
                {' '}
                {e}
              </option>
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
            {filtredCharacters.length}
            {' '}
            {!isFilterClear && <span>- Filtros aplicados</span>}
          </h3>
        </div>
        {filtredCharacters.length === 0 ? (
          <NotFound />
        ) : (
          <SortableContext
            items={filtredCharacters}
            strategy={verticalListSortingStrategy}
          >
            {
              filtredCharacters.map((character) => (
                <CharacterSorteble
                  id={character.id}
                  title={character.title}
                  image={character.image}
                  color={character.color}
                  category={character.category}
                  age={character.age}
                  resume={character.resume}
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

export default CharactersList;
