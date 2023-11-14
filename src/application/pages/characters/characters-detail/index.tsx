import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import './characters-detail.css';
import ICharacter from '../../../../domain/characterModel';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions';
import utils from '../../../../service/utils';
import GenericModal from '../../../components/generic-modal';

function CharacterDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const characters = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.characters));
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const { id } = useParams();
  const currentCharacter = characters?.find((e) => e.id === Number(id));

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleDelete = async () => {
    await indexedDBrepository.deleteCard(Number(id), 'characters');
    navigate('/characters');
  };

  const [stateCharacter,
    setEditedName] = useState<ICharacter | Partial<ICharacter>>(currentCharacter || {});

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
    if (Object.keys(stateCharacter).length === 0) {
      navigate('/');
    } else {
      indexedDBrepository.characterUpdate(Number(id), stateCharacter as ICharacter);
    }
  }, [dispatch, stateCharacter, id, navigate]);

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  const hadleRandomColor = () => {
    const colorRandon = utils.randomColor();
    setEditedName({ ...stateCharacter, color: colorRandon });
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
          placeholder="Nome da personagem"
        />
        <div className="detailBar">
          <div className="detailBarBbutton">
            <button className="detailAdd" type="button">{ }</button>
            <button className="btnSmall" type="button" onClick={openModal}>
              <span className="ui-icon ui-icon-trash icon-color" />
              {' '}
              Excluir
            </button>
          </div>
        </div>
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
              {prjSettings?.charactersCategory.map((e) => (
                <option key={e} value={e}>
                  •
                  {' '}
                  {e}
                </option>
              ))}
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
              {prjSettings?.charactersGenrders.map((e) => (
                <option key={e} value={e}>
                  •
                  {' '}
                  {e}
                </option>
              ))}
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
            <h3>
              Aleatória
            </h3>
            <button type="button" className="btnRandom" title="Gerar aleatoriamente uma cor" onClick={hadleRandomColor}>
              ↻
            </button>
          </div>
        </div>
        <div className="divider div-transparent" />
        <div className="fullContent">
          <h3>Resumo</h3>
          <textarea
            className="cardInputFull"
            placeholder="Descreva de forma breve quem é essa personagem..."
            value={stateCharacter?.resume}
            onChange={(e) => handleTextAreaChange(e, 'resume')}
          />
          <h3>Anotações</h3>
          <textarea
            className="cardInputFull"
            placeholder="Lembretes, ideias, problemas, apontamentos, reflexões..."
            value={stateCharacter?.note}
            onChange={(e) => handleTextAreaChange(e, 'note')}
          />
          <h3>Conteúdo</h3>
          <textarea
            className="cardInputFull"
            placeholder="Campo de texto livre..."
            value={stateCharacter?.content}
            onChange={(e) => handleTextAreaChange(e, 'content')}
          />
        </div>
      </div>
      <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir personagem?" onDataSend={handleDelete} deleteType />
    </div>
  );
}

export default CharacterDetail;
