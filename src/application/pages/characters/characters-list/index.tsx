import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MouseEvent, useEffect, useState } from 'react';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import ICharacter from '../../../../interfaces/ICharacter';
import './characters-list.css';
import utils from '../../../../service/utils';
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
  const navigate = useNavigate();

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

  const changePosition = async (
    e: MouseEvent<HTMLButtonElement>,
    list: ICharacter[],
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
      await characterService.upDatePosition(newI);
      dispatch(fetchProjectDataAction(true));
    } else if (!toUp && list && selectedI < list.length - 1) {
      const newI = list;
      const swapIndex = selectedI + 1;
      [newI[swapIndex], newI[selectedI]] = [newI[selectedI], newI[swapIndex]];
      await characterService.upDatePosition(newI);
      dispatch(fetchProjectDataAction(true));
    }
  };

  return (
    characters.length === 0 ? (
      <NoData dataType="personagens" />
    ) : (
      <div>
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
          filtredCharacters.map((character) => (
            <button onClick={() => navigate(`/characters/${character.id}`)} type="button" key={character.id} className="listItens">
              <div className="listCard">
                {character.image ? (
                  <img className="charListImage" src={character.image} alt="person img" />
                ) : (
                  <img className="charListImage" src="./images/person.png" alt="person img" />
                )}
                <div style={{ width: '100%' }}>
                  <div className="titleCardSection">
                    <h3 className="cardListTitle">
                      <span className="charTagIcon" style={{ backgroundColor: `${character.color || 'var(--text-color-sec)'}` }} />
                      {character.title}
                    </h3>
                    {isFilterClear && (
                      <div style={{ display: 'flex', gap: '0.5em' }}>
                        <button onClick={(e) => changePosition(e, characters, true, character.id)} className="btnSmall deleteButton" type="button">▲</button>
                        <button onClick={(e) => changePosition(e, characters, false, character.id)} className="btnSmall deleteButton" type="button">▼</button>
                      </div>
                    )}
                  </div>
                  <p className="categoryListItem">
                    {character.category}
                    {' '}
                    {character.age ? `• ${character.age} anos` : ''}
                  </p>
                  <p>{utils.abreviarString(character.resume, 300)}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    )
  );
}

export default CharactersList;
