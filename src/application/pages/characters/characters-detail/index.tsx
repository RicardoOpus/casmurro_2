import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import './characters-detail.css';
import ICharacter from '../../../../domain/characterModel';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import utils from '../../../../service/utils';
import GenericModal from '../../../components/generic-modal';
import TypeWriterSound from '../../../components/type-write-sound';
import BackButton from '../../../components/back-button';
import NextAndPrevCard from '../../../components/next-and-prev';

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
    const now = Date.now();
    setEditedName({ ...stateCharacter, [key]: e.target.value, last_edit: now });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    const now = Date.now();
    setEditedName({ ...stateCharacter, [key]: e.target.value, last_edit: now });
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    const now = Date.now();
    setEditedName({ ...stateCharacter, [key]: e.target.value, last_edit: now });
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

  const saveImage = async (event: EventTarget & HTMLInputElement) => {
    if (event && event.files && event.files.length > 0) {
      const base64Data = await utils.convertBase64(event.files[0]);
      const base64String = base64Data?.toString();
      if (base64String) {
        const result = await utils.resizeImage(base64String, 150, 150);
        if (result) {
          setEditedName({ ...stateCharacter, image: result.toString() });
        }
      }
    }
  };

  const clearImage = () => {
    setEditedName({ ...stateCharacter, image: '' });
  };

  const handleFileInput = (event: EventTarget & HTMLInputElement) => {
    const fileName = event.value;
    const isJpg = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
    const isPng = fileName.endsWith('.png');
    if (isJpg || isPng) {
      saveImage(event);
    } else {
      // eslint-disable-next-line no-alert
      alert('O arquivo selecionado não é uma imagem!');
    }
  };

  useEffect(() => {
    utils.autoGrowAllTextareas();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupFunction, []);

  useEffect(() => {
    setEditedName(currentCharacter || {});
  }, [currentCharacter, id]);

  return (
    <div className="innerContent">
      <div className="card">
        <BackButton page="/characters" />
        <NextAndPrevCard id={Number(id)} dataTable="characters" />
        <div className="profile-pic">
          <label className="-label" htmlFor="file">
            <span>Mudar imagem</span>
            <input id="file" type="file" accept=".jpg, jpeg, .png" onChange={(e) => handleFileInput(e.target)} />
          </label>
          {stateCharacter.image ? (
            <img src={stateCharacter.image} id="output" alt="character" />
          ) : (
            <img src="./person.png" id="output" alt="character" />
          )}
        </div>
        <input
          onChange={(e) => handleInputChange(e, 'title')}
          value={stateCharacter?.title}
          className="detailInputTitle"
          type="text"
          placeholder="Nome da personagem"
        />
        <div className="detailBar">
          <div className="detailBarButtons">
            <div className="detailBarButtonsItens">
              <input
                className="chartaterColor"
                type="color"
                value={stateCharacter.color}
                onChange={(e) => handleInputChange(e, 'color')}
              />
              <button type="button" className="btnRandom" title="Gerar aleatoriamente uma cor" onClick={hadleRandomColor}>
                ↻
              </button>
              <button onClick={clearImage} className="btnSmall" type="button">Apagar imagem</button>
            </div>
            <div className="detailBarButtonsItens">
              <button className="detailAdd" type="button">{ }</button>
              <button className="btnSmall" type="button" onClick={openModal}>
                <span className="ui-icon ui-icon-trash icon-color" />
                {' '}
                Excluir
              </button>
            </div>
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
              {prjSettings?.charactersGenders.map((e) => (
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
            <h3>Núcleo</h3>
            <select
              className="selectFullWith"
              value={stateCharacter?.core_group}
              onChange={(e) => handleSelectChange(e, 'core_group')}
            >
              <option value="">{ }</option>
              {prjSettings?.charactersCoreGroupes.map((e) => (
                <option key={e} value={e}>
                  •
                  {' '}
                  {e}
                </option>
              ))}
            </select>
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
      {prjSettings.typeWriterSound && (<TypeWriterSound />)}
    </div>
  );
}

export default CharacterDetail;
