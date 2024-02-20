import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChangeEvent, useEffect, useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import BackButton from '../../../components/back-button';
import NextAndPrevCard from '../../../components/next-and-prev';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import GenericModal from '../../../components/generic-modal';
import utils from '../../../../service/utils';
import Loading from '../../../components/loading';
import INotes from '../../../../interfaces/INotes';
import TaskList from '../../../components/task-list';
import ITaskList from '../../../../interfaces/ITaskList';
import NotesAddonsModal from '../notes-addons';
import ILinks from '../../../../interfaces/ILinks';
import LinksModal from '../../../components/add-link-modal';
import notesService from '../../../../service/notesService';
import { modulesFull } from '../../../../templates/quillMudules';

function NotesDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [modalAddons, setModalAddons] = useState(false);
  const [modalLink, setModalLink] = useState(false);
  const notesItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.notes));
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const { id } = useParams();
  const currentNoteItem = notesItens?.find((e) => e.id === Number(id));
  const [stateNoteItem,
    setStateNoteItem] = useState<INotes | Partial<INotes>>(currentNoteItem || {});

  const callBackLoading = () => setIsLoading(true);
  const closeModal = () => setModal(false);
  const closeModal2 = () => setModalAddons(false);
  const closeModal4 = () => setModalLink(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const updatedState = { ...stateNoteItem, [key]: e.target.value, last_edit: Date.now() };
    setStateNoteItem(updatedState);
    notesService.upDate(Number(id), updatedState as INotes);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    const updatedState = { ...stateNoteItem, [key]: e.target.value, last_edit: Date.now() };
    setStateNoteItem(updatedState);
    notesService.upDate(Number(id), updatedState as INotes);
  };

  const handleTextAreaChange = (e: string, key: string) => {
    const updatedState = { ...stateNoteItem, [key]: e, last_edit: Date.now() };
    setStateNoteItem(updatedState);
    notesService.upDate(Number(id), updatedState as INotes);
  };

  const updateCharacterTasks = (newtask: ITaskList[] | undefined) => {
    const updatedState = { ...stateNoteItem, task_list: newtask };
    setStateNoteItem(updatedState);
    notesService.upDate(Number(id), updatedState as INotes);
  };

  const updateLinks = (newLinks: ILinks[]) => {
    const updatedState = { ...stateNoteItem, link_list: newLinks };
    setStateNoteItem(updatedState);
    notesService.upDate(Number(id), updatedState as INotes);
  };

  const handleInputCheck = (e: boolean, key: string) => {
    const updatedState = { ...stateNoteItem, [key]: e, last_edit: Date.now() };
    setStateNoteItem(updatedState);
    notesService.upDate(Number(id), updatedState as INotes);
  };

  const handleDelete = async () => {
    await notesService.deleteNote(Number(id));
    dispatch(fetchProjectDataAction(true));
    navigate('/notes');
  };

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  const saveImage = async (event: EventTarget & HTMLInputElement) => {
    if (event && event.files && event.files.length > 0) {
      const base64Data = await utils.convertBase64(event.files[0]);
      const base64String = base64Data?.toString();
      if (base64String) {
        const updatedState = { ...stateNoteItem, image: base64String.toString() };
        setStateNoteItem(updatedState);
        notesService.upDate(Number(id), updatedState as INotes);
      }
    }
  };

  const clearImage = () => {
    const updatedState = { ...stateNoteItem, image: '' };
    setStateNoteItem(updatedState);
    notesService.upDate(Number(id), updatedState as INotes);
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
    const updatedLinks = stateNoteItem.link_list?.filter((_, index) => index !== indexLis);
    const updatedState = { ...stateNoteItem, link_list: updatedLinks };
    setStateNoteItem(updatedState);
    notesService.upDate(Number(id), updatedState as INotes);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(stateNoteItem).length === 0) {
        navigate('/');
      }
    };
    fetchData();
  }, [dispatch, stateNoteItem, id, navigate, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      utils.autoGrowAllTextareas();
    }
  }, [isLoading]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupFunction, []);

  useEffect(() => {
    setStateNoteItem(currentNoteItem || {});
    setIsLoading(false);
  }, [currentNoteItem, id]);

  return (
    <div className="innerContent">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="card">
          <BackButton page="/notes" />
          <NextAndPrevCard id={Number(id)} dataTable="notes" callback={callBackLoading} />
          {stateNoteItem.image && (
            <div className="imageCardBackgournd">
              <div className="cardImageDiv" style={{ backgroundImage: `url(${stateNoteItem.image})` }}>
                <img className="cardImage" src={stateNoteItem.image} id="output" alt="character" />
              </div>
            </div>
          )}
          <input
            onChange={(e) => handleInputChange(e, 'title')}
            value={stateNoteItem.title}
            className="detailInputTitle"
            type="text"
            placeholder="Título"
          />
          <div className="detailBarButtons">
            <div className="detailBarButtonsItens">
              {!stateNoteItem.image && (
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
              {stateNoteItem.image && (
                <span className="tooltip-default" data-balloon aria-label="Remover imagem" data-balloon-pos="down">
                  <label className="removeImage" htmlFor="removeImage">
                    <button id="removeImage" onClick={clearImage} className="btnInvisible" type="button">{ }</button>
                  </label>
                </span>
              )}
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
                value={stateNoteItem?.category}
                onChange={(e) => handleSelectChange(e, 'category')}
              >
                <option value="">{ }</option>
                {prjSettings?.notesCategory.map((e) => (
                  <option key={e} value={e}>{`• ${e}`}</option>
                ))}
              </select>
            </div>
          </div>
          {stateNoteItem.link_list && stateNoteItem.link_list.length > 0 && (
            <div className="fullContent">
              <h3>Links</h3>
              <div className="linkList">
                {stateNoteItem.link_list.map((e, index) => (
                  <div key={uuidv4()}>
                    <button className="removeRelationBtn" type="button" onClick={() => deleteLink(index)}>✖</button>
                    <a href={e.URL} target="_blank" rel="noreferrer">{e.linkName}</a>
                  </div>
                ))}
              </div>
            </div>
          )}
          {stateNoteItem.show_taskList && (
            <TaskList list={stateNoteItem.task_list} onDataSend={updateCharacterTasks} />
          )}
          <div className="fullContent">
            <h3>Conteúdo</h3>
            <ReactQuill
              theme="snow"
              value={stateNoteItem?.content}
              onChange={(e) => handleTextAreaChange(e, 'content')}
              modules={modulesFull}
              placeholder="Campo de texto livre"
            />
          </div>
          <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir nota?" onDataSend={handleDelete} deleteType />
          <NotesAddonsModal
            openModal={modalAddons}
            onClose={closeModal2}
            showtaskList={stateNoteItem.show_taskList || false}
            handleInputCheck={handleInputCheck}
          />
          <LinksModal
            openModal={modalLink}
            onClose={closeModal4}
            currentList={stateNoteItem.link_list || []}
            updateLinks={updateLinks}
          />
        </div>
      )}
    </div>
  );
}

export default NotesDetail;
