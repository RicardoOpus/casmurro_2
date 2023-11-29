import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import CharRelationsModal from './characters-relations';
import IRelation from '../../../../domain/IRelation';
import Loading from '../../../components/loading';
import CharAddonsModal from './characters-addons';
import TaskList from '../../../components/task-list';
import ITaskList from '../../../../domain/ITaskList';

function CharacterDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [modalRelations, setModalRalations] = useState(false);
  const [modalAddons, setModalAddons] = useState(false);
  const characters = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.characters));
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const { id } = useParams();
  const currentCharacter = characters?.find((e) => e.id === Number(id));
  const [stateRelations,
    setStateRelations] = useState<{
      charID: number;
      char: string; color: string; type: string;
    }[]>([]);

  const callBackLoading = () => setIsLoading(true);
  const closeModal = () => setModal(false);
  const closeModal2 = () => setModalRalations(false);
  const closeModal3 = () => setModalAddons(false);

  const [stateCharacter,
    setEditedName] = useState<ICharacter | Partial<ICharacter>>(currentCharacter || {});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setEditedName({ ...stateCharacter, [key]: e.target.value, last_edit: Date.now() });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    setEditedName({ ...stateCharacter, [key]: e.target.value, last_edit: Date.now() });
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    setEditedName({ ...stateCharacter, [key]: e.target.value, last_edit: Date.now() });
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const updateCharacterRelations = (newRelations: IRelation[]) => {
    setEditedName((prevCharacter) => ({
      ...prevCharacter,
      relations: newRelations,
    }));
  };

  const updateCharacterTasks = (newtask: ITaskList[] | undefined) => {
    setEditedName((prevtask) => ({
      ...prevtask,
      task_list: newtask,
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputCheck = (e: boolean, key: string) => {
    setEditedName({ ...stateCharacter, [key]: e, last_edit: Date.now() });
  };

  const handleDelete = async () => {
    await indexedDBrepository.deleteCard(Number(id), 'characters');
    navigate('/characters');
  };

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
        setEditedName({ ...stateCharacter, image: base64String });
      }
    }
  };

  const clearImage = () => {
    setEditedName({ ...stateCharacter, image: '' });
  };

  const handleFileInput = (event: EventTarget & HTMLInputElement) => {
    if (utils.isImageFile(event.value)) {
      saveImage(event);
    } else {
      // eslint-disable-next-line no-alert
      alert('O arquivo selecionado não é uma imagem!');
    }
  };

  const deleteRelation = (relationId: number) => {
    const updatedRelations = stateCharacter.relations?.filter((_, index) => index !== relationId);
    setEditedName({ ...stateCharacter, relations: updatedRelations });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(stateCharacter).length === 0) {
        navigate('/');
      } if (!isLoading) {
        indexedDBrepository.characterUpdate(Number(id), stateCharacter as ICharacter);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, stateCharacter, id, navigate, isLoading]);

  useEffect(() => {
    const relationsArray = stateCharacter.relations
      ?.reduce<{
        charID: number;
        char: string; color: string; type: string;
      }[]>((accumulator, e) => {
        const char = characters?.find((ele) => ele.id === e.charID);
        if (char && char.color) {
          const newdata = {
            charID: char.id, char: char.title, color: char.color, type: e.type,
          };
          accumulator.push(newdata);
        }
        return accumulator;
      }, []);
    if (relationsArray) {
      setStateRelations(relationsArray);
    }
  }, [stateCharacter.relations, characters]);

  useEffect(() => {
    if (!isLoading) {
      utils.autoGrowAllTextareas();
    }
  }, [isLoading, handleInputCheck]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupFunction, []);

  useEffect(() => {
    setEditedName(currentCharacter || {});
    setIsLoading(false);
  }, [currentCharacter, id]);

  return (
    <div className="innerContent">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="card">
          <BackButton page="/characters" />
          <NextAndPrevCard id={Number(id)} dataTable="characters" callback={callBackLoading} />
          <div className="profile-pic">
            <label className="-label" htmlFor="file">
              <span>Mudar imagem</span>
              <input id="file" type="file" accept=".jpg, .jpeg, .png, .webp" onChange={(e) => handleFileInput(e.target)} />
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
                <span className="tooltip-default" data-balloon aria-label="Cor aleatória" data-balloon-pos="down">
                  <button type="button" className="btnRandom" onClick={hadleRandomColor}>
                    ↻
                  </button>
                </span>
                <button onClick={clearImage} className="btnSmall" type="button">✖ imagem</button>
                <button onClick={() => setModalRalations(true)} className="btnSmall" type="button">+ Relações</button>
              </div>
              <div className="detailBarButtonsItens">
                <span className="tooltip-default" data-balloon aria-label="Mostrar/ocultar campos extras" data-balloon-pos="down">
                  <button className="detailAdd" type="button" onClick={() => setModalAddons(true)}>{ }</button>
                </span>
                <button className="btnSmall" type="button" onClick={() => setModal(true)}>
                  <span className="ui-icon ui-icon-trash icon-color" />
                  {' '}
                  Excluir
                </button>
              </div>
            </div>
          </div>
          <div className="divider div-transparent" />
          {stateCharacter.show_full_name && (
            <div className="fullContent">
              <h3>Nome completo</h3>
              <input
                onChange={(e) => handleInputChange(e, 'full_name')}
                value={stateCharacter?.full_name}
                className="cardInput"
                type="text"
                placeholder="Nome completo"
              />
            </div>
          )}
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
                  <option key={e} value={e}>{`• ${e}`}</option>
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
                  <option key={e} value={e}>{`• ${e}`}</option>
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
              {stateCharacter.showDate_birth && (
                <div>
                  <h3>Data Nascimento</h3>
                  <input value={stateCharacter.date_birth} className="cardInputDate" onChange={(e) => handleInputChange(e, 'date_birth')} type="date" />
                </div>
              )}
              {stateCharacter.showDate_death && (
                <div>
                  <h3>Data de morte</h3>
                  <input value={stateCharacter.date_death} className="cardInputDate" onChange={(e) => handleInputChange(e, 'date_death')} type="date" />
                </div>
              )}
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
                  <option key={e} value={e}>{`• ${e}`}</option>
                ))}
              </select>
            </div>
          </div>
          {stateRelations.length > 0 && (
            <div className="fullContent">
              <fieldset className="cardFiedset">
                <legend className="legendMedium">Relações</legend>
                {stateRelations.map((e, index) => (
                  <div key={uuidv4()}>
                    <span className="tooltip-default" data-balloon aria-label="Remover relação" data-balloon-pos="down">
                      <button className="removeRelationBtn" type="button" onClick={() => deleteRelation(index)}>✖</button>
                      {' '}
                    </span>
                    <button onClick={() => navigate(`/characters/${e.charID}`)} className="relationBtn" type="button" style={{ backgroundColor: e.color }}>{e.char}</button>
                    {' '}
                    <span>{`(${e.type})`}</span>
                  </div>
                ))}
              </fieldset>
            </div>
          )}
          {stateCharacter.showCharacteristics && (
            <div className="fullContent">
              <div className="characteristics">
                <div className="fullContent charctDiv">
                  <h3>Características Físicas</h3>
                  <textarea
                    className="cardInputFull"
                    placeholder="cor dos olhos, cabelo, etc..."
                    value={stateCharacter?.physical}
                    onChange={(e) => handleTextAreaChange(e, 'physical')}
                  />
                </div>
                <div className="fullContent charctDiv">
                  <h3>Características Psicológicas</h3>
                  <textarea
                    className="cardInputFull"
                    placeholder="atração, aversão, ideologia, traumas, etc..."
                    value={stateCharacter?.psychological}
                    onChange={(e) => handleTextAreaChange(e, 'psychological')}
                  />
                </div>
              </div>
            </div>
          )}
          {stateCharacter.show_taskList && (
            <TaskList list={stateCharacter.task_list} onDataSend={updateCharacterTasks} />
          )}
          <div className="fullContent">
            <h3>Resumo</h3>
            <textarea
              className="cardInputFull"
              placeholder="Descreva em poucas palavras quem é essa personagem"
              value={stateCharacter?.resume}
              onChange={(e) => handleTextAreaChange(e, 'resume')}
            />
            {stateCharacter.show_notes && (
              <div>
                <h3>Anotações</h3>
                <textarea
                  className="cardInputFull"
                  placeholder="Lembretes, ideias, problemas, apontamentos, reflexões..."
                  value={stateCharacter?.note}
                  onChange={(e) => handleTextAreaChange(e, 'note')}
                />
              </div>
            )}
            <h3>Conteúdo</h3>
            <textarea
              className="cardInputFull"
              placeholder="Campo de texto livre..."
              value={stateCharacter?.content}
              onChange={(e) => handleTextAreaChange(e, 'content')}
            />
          </div>
          <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir personagem?" onDataSend={handleDelete} deleteType />
          <CharRelationsModal
            openModal={modalRelations}
            onClose={closeModal2}
            charList={characters}
            currentCharacter={stateCharacter}
            updateCharacterRelations={updateCharacterRelations}
          />
          <CharAddonsModal
            openModal={modalAddons}
            onClose={closeModal3}
            showBirth={stateCharacter.showDate_birth || false}
            showDeath={stateCharacter.showDate_death || false}
            showCharact={stateCharacter.showCharacteristics || false}
            showFullName={stateCharacter.show_full_name || false}
            showNotes={stateCharacter.show_notes || false}
            showtaskList={stateCharacter.show_taskList || false}
            handleInputCheck={handleInputCheck}
          />
          {prjSettings.typeWriterSound && (<TypeWriterSound />)}
        </div>
      )}
    </div>
  );
}

export default CharacterDetail;
