import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import ICharacter from '../../../../domain/characterModel';
import './characters-list.css';
import utils from '../../../../service/utils';
import {
  charFilterTitleAction,
  charFilterCategoryAction,
  charFilterGenderAction,
  charFilterSortAction,
} from '../../../redux/actions/characterActions';

type RootState = {
  charFilterReducer: {
    selectedTitle: string,
    selectedCategory: string,
    selectedGender: string,
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
    isAscOrder,
  } = useSelector((state: RootState) => state.charFilterReducer);
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
    setClearFilters(true);
  };

  useEffect(() => {
    const handleFilter = (charactersList: ICharacter[]) => {
      const result = charactersList.filter((character) => {
        const titleMatch = !selectedTitle || character.title.includes(selectedTitle);
        const categoryMatch = !selectedCategory || character.category === selectedCategory;
        const genderMatch = !selectedGender || character.gender === selectedGender;
        return titleMatch && categoryMatch && genderMatch;
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
  }, [characters, selectedTitle, selectedCategory, selectedGender, isAscOrder, dispatch]);

  const handleSort = () => {
    const sortedList = [...filtredCharacters].reverse();
    setFiltredCharacters(sortedList);
    dispatch(charFilterSortAction(!isAscOrder));
  };

  return (
    characters.length === 0 ? (
      <div>
        <h1>Lista que NÃO tem</h1>
      </div>
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
          >
            <option value="">Gêneros</option>
            {prjSettings.charactersGenrders.map((e) => (
              <option key={e} value={e}>
                {' '}
                •
                {' '}
                {e}
              </option>
            ))}
          </select>
          <button className="btnSmall" type="button" onClick={clearAllFilters}>Limpar Filtros</button>
          <button className="btnSmall" type="button" onClick={handleSort} disabled={isAscOrder}>↑ Az</button>
          <button className="btnSmall" type="button" onClick={handleSort} disabled={!isAscOrder}>↓ Za</button>
        </div>
        {filtredCharacters.map((character) => (
          <button onClick={() => navigate(`/characters/${character.id}`)} type="button" key={character.id} className="listItens">
            <div className="characterCard">
              <img className="charListImage" src="./person.png" alt="person img" />
              <div>
                <h3 className="charactertTitle">
                  <span style={{ color: character.color || 'var(--text-color-sec)' }}>🯊 </span>
                  {character.title}
                </h3>
                <p className="categoryItem">
                  {character.category}
                  {' '}
                  {character.age ? `• ${character.age} anos` : ''}
                </p>
                <p>{utils.abreviarString(character.resume, 300)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    )
  );
}

export default CharactersList;
