import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import Character from '../../../../domain/characterModel';

function CharacterDetail() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const { id } = useParams();
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    if (projectData.data?.characters) {
      setCharacters(projectData.data.characters);
    }
  }, [projectData.data?.characters]);

  const currentCharacter = characters.find(
    (e) => e.id === Number(id),
  );

  return (
    <div className="innerContent">
      <div className="card">
        <h1>{currentCharacter?.title}</h1>
      </div>
    </div>
  );
}

export default CharacterDetail;
