import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BackButton from '../../../components/back-button';
import NextAndPrevCard from '../../../components/next-and-prev';
import IrootStateProject from '../../../../iterfaces/IRootStateProject';
import IWorld from '../../../../iterfaces/IWorld';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import GenericModal from '../../../components/generic-modal';
import utils from '../../../../service/utils';
import Loading from '../../../components/loading';
import WorldAddonsModal from '../world-addons';
import TaskList from '../../../components/task-list';
import ITaskList from '../../../../iterfaces/ITaskList';
import LinksModal from '../../../components/add-link-modal';
import ILinks from '../../../../iterfaces/ILinks';
import worldService from '../../../../service/worldService';

function WorldDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [modalAddons, setModalAddons] = useState(false);
  const [modalLink, setModalLink] = useState(false);
  const worldItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.world));
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const { id } = useParams();
  const currentWorldItem = worldItens?.find((e) => e.id === Number(id));
  const [stateWorldItem,
    setStateWorldItem] = useState<IWorld | Partial<IWorld>>(currentWorldItem || {});

  const callBackLoading = () => setIsLoading(true);
  const closeModal = () => setModal(false);
  const closeModal2 = () => setModalAddons(false);
  const closeModal4 = () => setModalLink(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const updatedState = { ...stateWorldItem, [key]: e.target.value, last_edit: Date.now() };
    setStateWorldItem(updatedState);
    worldService.upDate(Number(id), updatedState as IWorld);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    const updatedState = { ...stateWorldItem, [key]: e.target.value, last_edit: Date.now() };
    setStateWorldItem(updatedState);
    worldService.upDate(Number(id), updatedState as IWorld);
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    const updatedState = { ...stateWorldItem, [key]: e.target.value, last_edit: Date.now() };
    setStateWorldItem(updatedState);
    worldService.upDate(Number(id), updatedState as IWorld);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const updateCharacterTasks = (newtask: ITaskList[] | undefined) => {
    const updatedState = { ...stateWorldItem, task_list: newtask };
    setStateWorldItem(updatedState);
    worldService.upDate(Number(id), updatedState as IWorld);
  };

  const updateLinks = (newLinks: ILinks[]) => {
    const updatedState = { ...stateWorldItem, link_list: newLinks };
    setStateWorldItem(updatedState);
    worldService.upDate(Number(id), updatedState as IWorld);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputCheck = (e: boolean, key: string) => {
    const updatedState = { ...stateWorldItem, [key]: e, last_edit: Date.now() };
    setStateWorldItem(updatedState);
    worldService.upDate(Number(id), updatedState as IWorld);
  };

  const handleDelete = async () => {
    await worldService.deleteWorldItem(Number(id));
    dispatch(fetchProjectDataAction(true));
    navigate('/world');
  };

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  const saveImage = async (event: EventTarget & HTMLInputElement) => {
    if (event && event.files && event.files.length > 0) {
      const base64Data = await utils.convertBase64(event.files[0]);
      const base64String = base64Data?.toString();
      if (base64String) {
        const updatedState = { ...stateWorldItem, image: base64String.toString() };
        setStateWorldItem(updatedState);
        worldService.upDate(Number(id), updatedState as IWorld);
      }
    }
  };

  const clearImage = () => {
    const updatedState = { ...stateWorldItem, image: '' };
    setStateWorldItem(updatedState);
    worldService.upDate(Number(id), updatedState as IWorld);
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
    const updatedLinks = stateWorldItem.link_list?.filter((_, index) => index !== indexLis);
    const updatedState = { ...stateWorldItem, link_list: updatedLinks };
    setStateWorldItem(updatedState);
    worldService.upDate(Number(id), updatedState as IWorld);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(stateWorldItem).length === 0) {
        navigate('/');
      }
    };
    fetchData();
  }, [dispatch, stateWorldItem, id, navigate, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      utils.autoGrowAllTextareas();
    }
  }, [isLoading, handleInputCheck]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupFunction, []);

  useEffect(() => {
    setStateWorldItem(currentWorldItem || {});
    setIsLoading(false);
  }, [currentWorldItem, id]);

  return (
    <div className="innerContent">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="card">
          <BackButton page="/world" />
          <NextAndPrevCard id={Number(id)} dataTable="world" callback={callBackLoading} />
          {stateWorldItem.image ? (
            <div className="imageCardBackgournd">
              <div className="cardImageDiv" style={{ backgroundImage: `url(${stateWorldItem.image})` }}>
                <img className="cardImage" src={stateWorldItem.image} id="output" alt="character" />
              </div>
            </div>
          ) : (
            <div />
          )}
          <input
            onChange={(e) => handleInputChange(e, 'title')}
            value={stateWorldItem.title}
            className="detailInputTitle"
            type="text"
            placeholder="Título"
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
              <h3>Categoria</h3>
              <select
                className="selectFullWith"
                value={stateWorldItem?.category}
                onChange={(e) => handleSelectChange(e, 'category')}
              >
                <option value="">{ }</option>
                {prjSettings?.worldCategory.map((e) => (
                  <option key={e} value={e}>{`• ${e}`}</option>
                ))}
              </select>
            </div>
            {stateWorldItem.show_date && (
              <div>
                <h3>Data</h3>
                <input value={stateWorldItem.date} className="cardInputDate" onChange={(e) => handleInputChange(e, 'date')} type="date" />
              </div>
            )}
          </div>
          {stateWorldItem.link_list && stateWorldItem.link_list.length > 0 && (
            <div className="fullContent">
              <h3>Links</h3>
              <div className="linkList">
                {stateWorldItem.link_list.map((e, index) => (
                  <div key={uuidv4()}>
                    <button className="removeRelationBtn" type="button" onClick={() => deleteLink(index)}>✖</button>
                    <a href={e.URL} target="_blank" rel="noreferrer">{e.linkName}</a>
                  </div>
                ))}
              </div>
            </div>
          )}
          {stateWorldItem.show_taskList && (
            <TaskList list={stateWorldItem.task_list} onDataSend={updateCharacterTasks} />
          )}
          <div className="fullContent">
            <h3>Resumo</h3>
            <textarea
              className="cardInputFull"
              placeholder="Descreva de forma breve o item..."
              value={stateWorldItem?.resume}
              onChange={(e) => handleTextAreaChange(e, 'resume')}
            />
            {stateWorldItem.show_note && (
              <div>
                <h3>Anotações</h3>
                <textarea
                  className="cardInputFull"
                  placeholder="Lembretes, ideias, problemas, apontamentos, reflexões..."
                  value={stateWorldItem?.note}
                  onChange={(e) => handleTextAreaChange(e, 'note')}
                />
              </div>
            )}
            <h3>Conteúdo</h3>
            <textarea
              className="cardInputFull"
              placeholder="Campo de texto livre..."
              value={stateWorldItem?.content}
              onChange={(e) => handleTextAreaChange(e, 'content')}
            />
          </div>
          <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir item mundo?" onDataSend={handleDelete} deleteType />
          <WorldAddonsModal
            openModal={modalAddons}
            onClose={closeModal2}
            showDate={stateWorldItem.show_date || false}
            showNote={stateWorldItem.show_note || false}
            showtaskList={stateWorldItem.show_taskList || false}
            handleInputCheck={handleInputCheck}
          />
          <LinksModal
            openModal={modalLink}
            onClose={closeModal4}
            currentList={stateWorldItem.link_list || []}
            updateLinks={updateLinks}
          />
        </div>
      )}
    </div>
  );
}

export default WorldDetail;
