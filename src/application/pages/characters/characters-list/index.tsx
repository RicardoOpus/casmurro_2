import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import Character from '../../../../domain/characterModel';
import './characters-list.css';
import utils from '../../../../service/utils';

function CharactersList() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [filtredCharacters, setFiltredCharacters] = useState<Character[]>([]);
  const [, setClearFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (projectData.data?.characters) {
      setCharacters(projectData.data.characters);
      setFiltredCharacters(projectData.data.characters);
    }
  }, [projectData.data?.characters]);

  // const filtredCharacters = characters.filter((character) => {
  //   const titleMatch = !selectedTitle || character.title.includes(selectedTitle);
  //   const categoryMatch = !selectedCategory || character.category === selectedCategory;
  //   const genderMatch = !selectedGender || character.gender === selectedGender;
  //   return titleMatch && categoryMatch && genderMatch;
  // });

  const clearAllFilters = () => {
    setSelectedTitle('');
    setSelectedCategory('');
    setSelectedGender('');
    setClearFilters(true);
  };

  useEffect(() => {
    const handleFilter = (charactersList: Character[]) => {
      const result = charactersList.filter((character) => {
        const titleMatch = !selectedTitle || character.title.includes(selectedTitle);
        const categoryMatch = !selectedCategory || character.category === selectedCategory;
        const genderMatch = !selectedGender || character.gender === selectedGender;
        return titleMatch && categoryMatch && genderMatch;
      });
      setFiltredCharacters(result);
    };
    handleFilter(characters);
  }, [characters, selectedTitle, selectedCategory, selectedGender]);

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
            placeholder="Pesquisar por título..."
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              setSelectedTitle(target.value);
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            onChange={(e) => setSelectedGender(e.target.value)}
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
          <button type="button" onClick={clearAllFilters}>Limpar Filtros</button>
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
