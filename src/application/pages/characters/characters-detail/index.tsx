import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import './characters-detail.css';
import Character from '../../../../domain/characterModel';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions';
import utils from '../../../../service/utils';

function CharacterDetail() {
  const dispatch = useDispatch();
  const characters = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.characters));
  const { id } = useParams();
  const currentCharacter = characters?.find((e) => e.id === Number(id));

  const [stateCharacter,
    setEditedName] = useState<Character | Partial<Character>>(currentCharacter || {});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setEditedName({ ...stateCharacter, [key]: e.target.value });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    setEditedName({ ...stateCharacter, [key]: e.target.value });
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    setEditedName({ ...stateCharacter, [key]: e.target.value });
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    indexedDBrepository.characterUpdate(Number(id), stateCharacter as Character);
  }, [dispatch, stateCharacter, id]);

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  useEffect(() => {
    utils.autoGrowAllTextareas();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupFunction, []);

  return (
    <div className="innerContent">
      <div className="card">
        <div className="characterImageDiv">
          <img className="characterImage" src="./person.png" alt="character" />
        </div>
        <input
          onChange={(e) => handleInputChange(e, 'title')}
          value={stateCharacter?.title}
          className="cardInputTitleChar"
          type="text"
          placeholder="NOME"
        />
        <div className="divider div-transparent" />
        <div className="charBasicInfos">
          <div>
            <h3>Categoria</h3>
            <select
              className="selectFullWith"
              value={stateCharacter?.category}
              onChange={(e) => handleSelectChange(e, 'category')}
            >
              <option value="">{ }</option>
              <option value="antagonista">• Antagonista</option>
              <option value="coadjuvante">• Coadjuvante</option>
              <option value="criatura">• Criatura</option>
              <option value="entidade">• Entidade</option>
              <option value="herói">• Herói</option>
              <option value="mascote">• Mascote</option>
              <option value="protagonista">• Protagonista</option>
              <option value="secundário">• Secundário</option>
              <option value="vilão">• Vilão</option>
            </select>
            <h3>Idade</h3>
            <input
              className="cardInput"
              type="number"
              value={stateCharacter?.age}
              onChange={(e) => handleInputChange(e, 'age')}
            />
          </div>
          <div>
            <h3>Gênero</h3>
            <select
              className="selectFullWith"
              value={stateCharacter?.gender}
              onChange={(e) => handleSelectChange(e, 'gender')}
            >
              <option value="">{ }</option>
              <option value="masculino">• Masculino</option>
              <option value="feminino">• Feminino</option>
              <option value="não-binário">• Não-Binário</option>
              <option value="gênero fluído">• Gênero Fluído</option>
              <option value="agênero">• Agênero</option>
              <option value="transexual">• Transexual</option>
              <option value="genderqueer">• Genderqueer</option>
              <option value="outro">• Outro</option>
            </select>
            <h3>Ocupação</h3>
            <input
              className="cardInput"
              type="text"
              value={stateCharacter?.occupation}
              onChange={(e) => handleInputChange(e, 'occupation')}
            />
          </div>
          <div>
            <h3>Cor</h3>
            <input
              className="chartaterColor"
              type="color"
              value={stateCharacter.color}
              onChange={(e) => handleInputChange(e, 'color')}
            />
          </div>
        </div>
        <div className="divider div-transparent" />
        <div className="fullContent">
          <h3>Conteúdo</h3>
          <textarea
            className="cardInputFull"
            placeholder="Campo livre..."
            value={stateCharacter?.content}
            onChange={(e) => handleTextAreaChange(e, 'content')}
          />
        </div>
      </div>
    </div>
  );
}

export default CharacterDetail;
