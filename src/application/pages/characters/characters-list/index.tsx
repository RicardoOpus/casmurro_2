import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import Character from '../../../../domain/characterModel';
import './characters-list.css';
import utils from '../../../../service/utils';

function CharactersList() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [characters, setCharacters] = useState<Character[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (projectData.data?.characters) {
      setCharacters(projectData.data.characters.reverse());
    }
  }, [projectData.data?.characters]);

  return (
    characters.length === 0 ? (
      <div>
        <h1>Lista que NÃO tem</h1>
      </div>
    ) : (
      <div>
        {characters.map((character) => (
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
