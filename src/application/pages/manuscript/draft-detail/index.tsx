import {
  ChangeEvent, SyntheticEvent, useEffect, useRef, useState,
} from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import './draft-detail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import IManuscript from '../../../../interfaces/IManuscript';
import Loading from '../../../components/loading';
import manuscriptService from '../../../../service/manuscriptService';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import utils from '../../../../service/utils';
import NoData from '../../../components/no-dada';
import GenericModal from '../../../components/generic-modal';
import DraftAddonsModal from './draft-detail-addons';
import TaskList from '../../../components/task-list';
import ITaskList from '../../../../interfaces/ITaskList';
import CharSceneModal from './char-scene';
import NextAndPrevCard from '../../../components/next-and-prev';
import useTabReplacement from '../../../hooks/useTabReplacement';
import { modulesFull } from '../../../../templates/quillMudules';

function DraftDetail() {
  const [height, setHeight] = useState(300);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [modalAddons, setModalAddons] = useState(false);
  const [modalCharScene, setModalCharScene] = useState(false);
  const charList = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.characters));
  const worldList = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.world));
  const placeList = worldList?.filter((e) => e.category === 'Local');
  const manuscriptItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.manuscript));
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const { id } = useParams();
  const currentMItem = manuscriptItens?.find((e) => e.id === Number(id));
  const [stateMItem,
    setStateManuItem] = useState<IManuscript | Partial<IManuscript>>({});

  const onResize = (
    _e: SyntheticEvent<Element, Event>,
    data: ResizeCallbackData,
  ) => {
    if (data.size && Number(data.size.height) > 60) {
      setHeight(data.size.height);
    }
  };

  const closeModal = () => setModal(false);
  const closeModalAddons = () => setModalAddons(false);
  const closeModalChar = () => setModalCharScene(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaNoteRef = useRef<HTMLTextAreaElement>(null);

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    if (stateMItem.id) {
      const updatedState = { ...stateMItem, [key]: e.target.value, last_edit: Date.now() };
      setStateManuItem(updatedState);
      manuscriptService.upDate(stateMItem.id, updatedState as IManuscript);
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    if (stateMItem.id) {
      if (key === 'pov_id') {
        const updatedState = { ...stateMItem, [key]: Number(e.target.value) };
        setStateManuItem(updatedState);
        manuscriptService.upDate(stateMItem.id, updatedState as IManuscript)
          .then(() => cleanupFunction());
      } else {
        const updatedState = { ...stateMItem, [key]: e.target.value };
        setStateManuItem(updatedState);
        manuscriptService.upDate(stateMItem.id, updatedState as IManuscript)
          .then(() => cleanupFunction());
      }
    }
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    if (stateMItem.id) {
      const updatedState = { ...stateMItem, [key]: e.target.value, last_edit: Date.now() };
      setStateManuItem(updatedState);
      manuscriptService.upDate(stateMItem.id, updatedState as IManuscript);
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleTextAreaChangeFull = (e: string, key: string) => {
    if (stateMItem.id === Number(id)) {
      const updatedState = { ...stateMItem, [key]: e, last_edit: Date.now() };
      setStateManuItem(updatedState);
      manuscriptService.upDate(stateMItem.id, updatedState as IManuscript);
    }
  };

  const handleDelete = async () => {
    if (currentMItem) {
      await manuscriptService.deleteScene(currentMItem.id).then(() => cleanupFunction());
    }
  };

  const handleTitleBlur = () => {
    cleanupFunction();
  };

  const updateCharScene = (e: number[]) => {
    if (stateMItem.id) {
      const updatedState = { ...stateMItem, scene_characters: e };
      setStateManuItem(updatedState);
      manuscriptService.upDate(stateMItem.id, updatedState as IManuscript);
    }
  };

  const updateSceneTasks = (newtask: ITaskList[] | undefined) => {
    if (stateMItem.id) {
      const updatedState = { ...stateMItem, task_list: newtask };
      setStateManuItem(updatedState);
      manuscriptService.upDate(stateMItem.id, updatedState as IManuscript);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputCheck = (e: boolean, key: string) => {
    if (stateMItem.id) {
      const updatedState = { ...stateMItem, [key]: e, last_edit: Date.now() };
      setStateManuItem(updatedState);
      manuscriptService.upDate(stateMItem.id, updatedState as IManuscript);
    }
  };

  const clearImage = () => {
    if (stateMItem.id) {
      const updatedState = { ...stateMItem, image: '' };
      setStateManuItem(updatedState);
      manuscriptService.upDate(stateMItem.id, updatedState as IManuscript);
    }
  };

  const saveImage = async (event: EventTarget & HTMLInputElement) => {
    if (event && event.files && event.files.length > 0) {
      const base64Data = await utils.convertBase64(event.files[0]);
      const base64String = base64Data?.toString();
      if (base64String && stateMItem.id) {
        const updatedState = { ...stateMItem, image: base64String.toString() };
        setStateManuItem(updatedState);
        manuscriptService.upDate(stateMItem.id, updatedState as IManuscript);
      }
    }
  };

  const handleFileInput = (event: EventTarget & HTMLInputElement) => {
    if (utils.isImageFile(event.value)) {
      saveImage(event);
    } else {
      // eslint-disable-next-line no-alert
      alert('O arquivo selecionado não é uma imagem!');
    }
  };

  const callBackLoading = () => {
    setIsLoading(true);
  };

  const callbackScene = async (e: number) => {
    await manuscriptService.updateCurrent(e).then(() => setIsLoading(false));
    dispatch(fetchProjectDataAction(true));
  };

  useTabReplacement(textareaRef, isLoading);
  useTabReplacement(textareaNoteRef, isLoading);

  useEffect(() => {
    if (!isLoading) {
      utils.autoGrowAllTextareas();
    }
  }, [isLoading, handleInputCheck]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupFunction, []);

  useEffect(() => {
    if (currentMItem) {
      setStateManuItem(currentMItem);
      setIsLoading(false);
      if (currentMItem.type !== 'Cena') {
        setHeight(600);
      } else {
        setHeight(700);
      }
    }
  }, [currentMItem, id]);

  return (
    !currentMItem ? (
      <NoData dataType="Cenas selecionadas" />
    ) : (
      <Resizable className="resizableDraftDetail" width={600} height={height} onResize={onResize} handle={<div className="custom-handle-x" />}>
        <div style={{ width: '100%', height: `${height}px` }}>
          {isLoading ? (
            <Loading />
          ) : (
            <div style={{ overflow: 'scroll', height: `${height}px` }}>
              <div className="detailMContainer">
                <NextAndPrevCard id={Number(id)} dataTable="manuscript" callback={callBackLoading} callbackScene={callbackScene} />
                {stateMItem.image && (
                  <div className="imageCardBackgournd">
                    <div className="cardImageDiv" style={{ backgroundImage: `url(${stateMItem.image})` }} />
                  </div>
                )}
                <input
                  onChange={(e) => handleInputChange(e, 'title')}
                  value={stateMItem.title}
                  className="detailInputTitle"
                  type="text"
                  placeholder="Título"
                  onBlur={handleTitleBlur}
                />
                <div className="detailBarButtons">
                  <div className="detailBarButtonsItens">
                    {stateMItem.type === 'Cena' && (
                      <div className="detailBarButtonsItens">
                        <span className="tooltip-default" data-balloon aria-label="Personagens em cena" data-balloon-pos="right">
                          <label className="addCharScene" htmlFor="addCharScene">
                            <button id="addCharScene" onClick={() => setModalCharScene(true)} className="btnInvisible" type="button">{ }</button>
                          </label>
                        </span>
                        {!stateMItem.image && (
                          <span className="tooltip-default" data-balloon aria-label="Adicionar imagem" data-balloon-pos="down">
                            <label htmlFor="addImage">
                              <div className="profile-pic addImage">
                                <input
                                  id="addImage"
                                  accept=".jpg, .jpeg, .png, .webp"
                                  onChange={(e) => handleFileInput(e.target)}
                                  type="file"
                                />
                              </div>
                            </label>
                          </span>
                        )}
                        {stateMItem.image && (
                          <span className="tooltip-default" data-balloon aria-label="Remover imagem" data-balloon-pos="down">
                            <label className="removeImage" htmlFor="removeImage">
                              <button id="removeImage" onClick={clearImage} className="btnInvisible" type="button">{ }</button>
                            </label>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="detailBarButtonsItens">
                    {stateMItem.type === 'Cena' && (
                      <span className="tooltip-default" data-balloon aria-label="Mostrar/ocultar campos extras" data-balloon-pos="down">
                        <button className="detailAdd" type="button" onClick={() => setModalAddons(true)}>{ }</button>
                      </span>
                    )}
                    <button onClick={() => setModal(true)} className="btnSmall" type="button">
                      <span className="ui-icon ui-icon-trash icon-color" />
                      {' '}
                      Excluir
                    </button>
                  </div>
                </div>
                <div className="divider div-transparent" />
                <div className="charBasicInfos">
                  <div>
                    <h3>Status</h3>
                    <select
                      className="selectFullWith"
                      value={stateMItem?.status}
                      onChange={(e) => handleSelectChange(e, 'status')}
                    >
                      <option value="">{ }</option>
                      {prjSettings?.manuscriptStatus.map((e) => (
                        <option key={e} value={e}>{`• ${e}`}</option>
                      ))}
                    </select>
                    {stateMItem.show_place && (
                      <div>
                        <h3>Local</h3>
                        <select
                          value={stateMItem.place}
                          className="selectFullWith"
                          onChange={(e) => handleSelectChange(e, 'place')}
                        >
                          <option value="">{ }</option>
                          {placeList?.map((char) => (
                            <option key={char.id} value={char.id}>
                              •
                              {' '}
                              {char.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div>
                    {stateMItem.show_pov && (
                      <div>
                        <h3>POV</h3>
                        <select
                          value={stateMItem.pov_id}
                          className="selectFullWith"
                          onChange={(e) => handleSelectChange(e, 'pov_id')}
                        >
                          <option value="">{ }</option>
                          {charList?.map((char) => (
                            <option key={char.id} value={char.id}>
                              •
                              {' '}
                              {char.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {stateMItem.show_weather && (
                      <div>
                        <h3>Clima</h3>
                        <select
                          className="selectFullWith"
                          value={stateMItem?.weather}
                          onChange={(e) => handleSelectChange(e, 'weather')}
                        >
                          <option value="">{ }</option>
                          {prjSettings?.manuscriptWeather.map((e) => (
                            <option key={e} value={e}>{`• ${e}`}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div>
                    {stateMItem.show_date && (
                      <div>
                        <h3>Data</h3>
                        <input value={stateMItem.date} className="cardInputDate" onChange={(e) => handleInputChange(e, 'date')} type="date" />
                      </div>
                    )}
                    {stateMItem.show_time && (
                      <div>
                        <h3>Hora</h3>
                        <input value={stateMItem.time} className="cardInputDate" onChange={(e) => handleInputChange(e, 'time')} type="time" />
                      </div>
                    )}
                  </div>
                  {stateMItem.show_goalWC && (
                    <div>
                      <h3>Meta de palavras</h3>
                      <input
                        className="cardInput"
                        type="number"
                        value={stateMItem.goalWC}
                        onChange={(e) => handleInputChange(e, 'goalWC')}
                        onBlur={handleTitleBlur}
                      />
                    </div>
                  )}
                </div>
                {stateMItem.scene_characters && stateMItem.scene_characters.length > 0 && (
                  <div className="fullContent">
                    <h3>Personagens em cena</h3>
                    <div className="characters_scene_list">
                      {charList?.map((char) => (
                        (stateMItem?.scene_characters ?? []).includes(char.id) && (
                          <div key={char.id} className="elementCharScene">
                            <img className="imgCharScene" src={char.image ? char.image : './images/person.png'} alt="Character" />
                            <button onClick={() => navigate(`/characters/${char.id}`)} className="relationBtn" type="button" style={{ backgroundColor: char.color }}>{char.title}</button>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
                {stateMItem.show_taskList && (
                  <TaskList list={stateMItem.task_list} onDataSend={updateSceneTasks} />
                )}
                <div className="fullContent">
                  <h3>Resumo</h3>
                  <textarea
                    ref={textareaRef}
                    className="cardInputFull"
                    placeholder={stateMItem.type === 'Cena' ? 'Descreva de forma breve a cena...' : 'Descreve o capítulo...'}
                    value={stateMItem?.resume}
                    onChange={(e) => handleTextAreaChange(e, 'resume')}
                  />
                  {stateMItem.show_notes && (
                    <div>
                      <h3>Anotações</h3>
                      <ReactQuill
                        theme="snow"
                        value={stateMItem?.note}
                        onChange={(e) => handleTextAreaChangeFull(e, 'note')}
                        modules={modulesFull}
                        placeholder="Campo de texto livre"
                      />
                    </div>
                  )}
                </div>
              </div>
              <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir Cena?" onDataSend={handleDelete} deleteType />
              <CharSceneModal
                openModal={modalCharScene}
                onClose={closeModalChar}
                charList={charList}
                sceneCharacters={stateMItem.scene_characters || []}
                updateCharacterRelations={updateCharScene}
              />
              <DraftAddonsModal
                openModal={modalAddons}
                onClose={closeModalAddons}
                showDate={stateMItem.show_date || false}
                showTime={stateMItem.show_time || false}
                showWeather={stateMItem.show_weather || false}
                showGoalWC={stateMItem.show_goalWC || false}
                showPOV={stateMItem.show_pov || false}
                showPlace={stateMItem.show_place || false}
                showNote={stateMItem.show_notes || false}
                showtaskList={stateMItem.show_taskList || false}
                handleInputCheck={handleInputCheck}
              />
            </div>
          )}
        </div>
      </Resizable>
    )
  );
}

export default DraftDetail;
