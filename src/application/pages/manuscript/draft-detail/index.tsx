import {
  ChangeEvent, SyntheticEvent, useEffect, useState,
} from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import './draft-detail.css';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import IrootStateProject from '../../../../domain/IrootStateProject';
import IManuscript from '../../../../domain/IManuscript';
import Loading from '../../../components/loading';
import manuscriptService from '../../../../service/manuscriptService';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import utils from '../../../../service/utils';
import NoData from '../../../components/no-dada';
import LinksModal from '../../../components/add-link-modal';
import ILinks from '../../../../domain/ILinks';
import GenericModal from '../../../components/generic-modal';
import DraftAddonsModal from './draft-detail-addons';
import TaskList from '../../../components/task-list';
import ITaskList from '../../../../domain/ITaskList';

function DraftDetail() {
  const [height, setHeight] = useState(300);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [modalLink, setModalLink] = useState(false);
  const [modalAddons, setModalAddons] = useState(false);
  const charList = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.characters));
  const worldList = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.world));
  const placeList = worldList?.filter((e) => e.category === 'Local');
  const manuscriptItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.manuscript));
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const currentMItem = manuscriptItens?.find((e) => e.current === true);
  const [stateMItem,
    setStateManuItem] = useState<IManuscript | Partial<IManuscript>>(currentMItem || {});

  const onResize = (
    _e: SyntheticEvent<Element, Event>,
    data: ResizeCallbackData,
  ) => {
    if (data.size && Number(data.size.height) > 60) {
      setHeight(data.size.height);
    }
  };

  const closeModal = () => setModal(false);
  const closeModalLink = () => setModalLink(false);
  const closeModalAddons = () => setModalAddons(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const updatedState = { ...stateMItem, [key]: e.target.value, last_edit: Date.now() };
    setStateManuItem(updatedState);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    if (key === 'pov_id') {
      setStateManuItem({ ...stateMItem, [key]: Number(e.target.value), last_edit: Date.now() });
    } else {
      setStateManuItem({ ...stateMItem, [key]: e.target.value, last_edit: Date.now() });
    }
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    setStateManuItem({ ...stateMItem, [key]: e.target.value, last_edit: Date.now() });
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  const handleDelete = async () => {
    if (currentMItem) {
      await manuscriptService.deleteScene(currentMItem.id).then(() => cleanupFunction());
    }
  };

  const handleTitleBlur = () => {
    cleanupFunction();
  };

  const updateCharacterTasks = (newtask: ITaskList[] | undefined) => {
    setStateManuItem((prevtask) => ({
      ...prevtask,
      task_list: newtask,
    }));
  };

  const updateLinks = (newLinks: ILinks[]) => {
    setStateManuItem((prevLinks) => ({
      ...prevLinks,
      link_list: newLinks,
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputCheck = (e: boolean, key: string) => {
    setStateManuItem({ ...stateMItem, [key]: e, last_edit: Date.now() });
  };

  const clearImage = () => {
    setStateManuItem({ ...stateMItem, image: '' });
  };

  const saveImage = async (event: EventTarget & HTMLInputElement) => {
    if (event && event.files && event.files.length > 0) {
      const base64Data = await utils.convertBase64(event.files[0]);
      const base64String = base64Data?.toString();
      if (base64String) {
        setStateManuItem({ ...stateMItem, image: base64String.toString() });
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

  const deleteLink = (indexLis: number) => {
    const updatedLinks = stateMItem.link_list?.filter((_, index) => index !== indexLis);
    setStateManuItem({ ...stateMItem, link_list: updatedLinks });
  };

  useEffect(() => {
    if (currentMItem) {
      setStateManuItem((prevState) => ({ ...prevState, ...currentMItem }));
    }
  }, [currentMItem]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentMItem) {
        await manuscriptService.upDate(currentMItem.id, stateMItem as IManuscript)
          .then(() => setIsLoading(false));
      }
    };
    fetchData();
  }, [currentMItem, stateMItem]);

  useEffect(() => {
    if (!isLoading) {
      utils.autoGrowAllTextareas();
    }
  }, [isLoading, handleInputCheck]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupFunction, []);

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
                {stateMItem.image ? (
                  <div className="imageCardBackgournd">
                    <div className="cardImageDiv" style={{ backgroundImage: `url(${stateMItem.image})` }}>
                      <img className="cardIstateWorldItemage" src={stateMItem.image} id="output" alt="character" />
                    </div>
                  </div>
                ) : (
                  <div />
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
                    <span className="tooltip-default" data-balloon aria-label="Adicionar imagem" data-balloon-pos="down">
                      <label htmlFor="addImage">
                        <div className="profile-pic addImage">
                          <input
                            id="addImage"
                            onChange={(e) => handleFileInput(e.target)}
                            type="file"
                          />
                        </div>
                      </label>
                    </span>
                    <span className="tooltip-default" data-balloon aria-label="Remover imagem" data-balloon-pos="down">
                      <label className="removeImage" htmlFor="removeImage">
                        <button id="removeImage" onClick={clearImage} className="btnInvisible" type="button">{ }</button>
                      </label>
                    </span>
                    <span className="tooltip-default" data-balloon aria-label="Adicionar link externo" data-balloon-pos="down">
                      <label className="addLink" htmlFor="addLink">
                        <button id="addLink" onClick={() => setModalLink(true)} className="btnInvisible" type="button">{ }</button>
                      </label>
                    </span>
                  </div>
                  <div className="detailBarButtonsItens">
                    <span className="tooltip-default" data-balloon aria-label="Mostrar/ocultar campos extras" data-balloon-pos="down">
                      <button className="detailAdd" type="button" onClick={() => setModalAddons(true)}>{ }</button>
                    </span>
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
                      />
                    </div>
                  )}
                </div>
                {stateMItem.link_list && stateMItem.link_list.length > 0 && (
                  <div className="fullContent">
                    <h3>Links</h3>
                    <div className="linkList">
                      {stateMItem.link_list.map((e, index) => (
                        <div key={uuidv4()}>
                          <button className="removeRelationBtn" type="button" onClick={() => deleteLink(index)}>✖</button>
                          <a href={e.URL} target="_blank" rel="noreferrer">{e.linkName}</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {stateMItem.show_taskList && (
                  <TaskList list={stateMItem.task_list} onDataSend={updateCharacterTasks} />
                )}
                <div className="fullContent">
                  <h3>Resumo</h3>
                  <textarea
                    className="cardInputFull"
                    placeholder="Descreva de forma breve a cena..."
                    value={stateMItem?.resume}
                    onChange={(e) => handleTextAreaChange(e, 'resume')}
                  />
                  {stateMItem.show_notes && (
                    <div>
                      <h3>Anotações</h3>
                      <textarea
                        className="cardInputFull"
                        placeholder="Lembretes, ideias, problemas, apontamentos, reflexões..."
                        value={stateMItem?.note}
                        onChange={(e) => handleTextAreaChange(e, 'note')}
                      />
                    </div>
                  )}
                </div>
              </div>
              <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir Cena?" onDataSend={handleDelete} deleteType />
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
              <LinksModal
                openModal={modalLink}
                onClose={closeModalLink}
                currentList={stateMItem.link_list || []}
                updateLinks={updateLinks}
              />
            </div>
          )}
        </div>
      </Resizable>
    )
  );
}

export default DraftDetail;
