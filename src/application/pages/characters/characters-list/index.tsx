import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IrootStateProject from '../../../../iterfaces/IrootStateProject';
import ICharacter from '../../../../iterfaces/characterModel';
import './characters-list.css';
import utils from '../../../../service/utils';
import {
  charFilterTitleAction,
  charFilterCategoryAction,
  charFilterGenderAction,
  charFilterCoreGroupAction,
  charFilterSortAction,
} from '../../../redux/actions/characterActions';
import NotFound from '../../../components/not-found';
import NoData from '../../../components/no-dada';

type RootStateChar = {
  charFilterReducer: {
    selectedTitle: string,
    selectedCategory: string,
    selectedGender: string,
    selectedCoreGroup: string,
    isAscOrder: boolean,
  }
};

function CharactersList() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const {
    selectedTitle,
    selectedCategory,
    selectedGender,
    selectedCoreGroup,
    isAscOrder,
  } = useSelector((state: RootStateChar) => state.charFilterReducer);
  const dispatch = useDispatch();

  const [filtredCharacters, setFiltredCharacters] = useState<ICharacter[]>([]);
  const [, setClearFilters] = useState(false);
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
    setClearFilters(true);
  };

  useEffect(() => {
    const handleFilter = (charactersList: ICharacter[]) => {
      const result = charactersList.filter((character) => {
        const titleMatch = !selectedTitle || character.title.includes(selectedTitle);
        const categoryMatch = !selectedCategory || character.category === selectedCategory;
        const genderMatch = !selectedGender || character.gender === selectedGender;
        const coreGroupMatch = !selectedCoreGroup || character.core_group === selectedCoreGroup;
        return titleMatch && categoryMatch && genderMatch && coreGroupMatch;
      });
      if (!isAscOrder) {
        const sortedList = [...result].reverse();
        setFiltredCharacters(sortedList);
        dispatch(charFilterSortAction(isAscOrder));
      } else {
        setFiltredCharacters(result);
      }
    };
    handleFilter(characters);
  }, [characters,
    selectedTitle, selectedCategory, selectedGender, selectedCoreGroup, isAscOrder, dispatch]);

  const handleSort = () => {
    const sortedList = [...filtredCharacters].reverse();
    setFiltredCharacters(sortedList);
    dispatch(charFilterSortAction(!isAscOrder));
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
          <button className="btnSmall" type="button" onClick={clearAllFilters}>✖ Filtros</button>
          <button className="btnSmall" type="button" onClick={handleSort} disabled={isAscOrder}>↑ Az</button>
          <button className="btnSmall" type="button" onClick={handleSort} disabled={!isAscOrder}>↓ Za</button>
        </div>
        <div className="amountInfoBar">
          <h3>
            Total
            {' '}
            {filtredCharacters.length}
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
                  <img className="charListImage" src="./person.png" alt="person img" />
                )}
                <div>
                  <h3 className="cardListTitle">
                    <span className="charTagIcon" style={{ backgroundColor: `${character.color || 'var(--text-color-sec)'}` }} />
                    {character.title}
                  </h3>
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
