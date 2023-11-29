import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import BackButton from '../../../components/back-button';
import NextAndPrevCard from '../../../components/next-and-prev';
import IrootStateProject from '../../../../domain/IrootStateProject';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import GenericModal from '../../../components/generic-modal';
import TypeWriterSound from '../../../components/type-write-sound';
import utils from '../../../../service/utils';
import Loading from '../../../components/loading';
import INotes from '../../../../domain/InotesModel';
import TaskList from '../../../components/task-list';
import ITaskList from '../../../../domain/ITaskList';
import NotesAddonsModal from '../notes-addons';

function NotesDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [modalAddons, setModalAddons] = useState(false);
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setStateNoteItem({ ...stateNoteItem, [key]: e.target.value, last_edit: Date.now() });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    setStateNoteItem({ ...stateNoteItem, [key]: e.target.value, last_edit: Date.now() });
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    setStateNoteItem({ ...stateNoteItem, [key]: e.target.value, last_edit: Date.now() });
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const updateCharacterTasks = (newtask: ITaskList[] | undefined) => {
    setStateNoteItem((prevtask) => ({
      ...prevtask,
      task_list: newtask,
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputCheck = (e: boolean, key: string) => {
    setStateNoteItem({ ...stateNoteItem, [key]: e, last_edit: Date.now() });
  };

  const handleDelete = async () => {
    await indexedDBrepository.deleteCard(Number(id), 'notes');
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
        setStateNoteItem({ ...stateNoteItem, image: base64String.toString() });
      }
    }
  };

  const clearImage = () => {
    setStateNoteItem({ ...stateNoteItem, image: '' });
  };

  const handleFileInput = (event: EventTarget & HTMLInputElement) => {
    if (utils.isImageFile(event.value)) {
      saveImage(event);
    } else {
      // eslint-disable-next-line no-alert
      alert('O arquivo selecionado não é uma imagem!');
    }
  };

  const closeModal2 = () => setModalAddons(false);

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(stateNoteItem).length === 0) {
        navigate('/');
      } if (!isLoading) {
        await indexedDBrepository.noteUpdate(Number(id), stateNoteItem as INotes);
        setIsLoading(false);
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
          {stateNoteItem.image ? (
            <div className="imageCardBackgournd">
              <div className="cardImageDiv" style={{ backgroundImage: `url(${stateNoteItem.image})` }}>
                <img className="cardImage" src={stateNoteItem.image} id="output" alt="character" />
              </div>
            </div>
          ) : (
            <div />
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
              <div className="profile-pic">
                <label className="-label2" htmlFor="file">
                  + imagem
                  <input id="file" type="file" accept=".jpg, .jpeg, .png, .webp" onChange={(e) => handleFileInput(e.target)} />
                </label>
              </div>
              <button onClick={clearImage} className="btnSmall" type="button">✖ imagem</button>
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
          {stateNoteItem.show_taskList && (
            <TaskList list={stateNoteItem.task_list} onDataSend={updateCharacterTasks} />
          )}
          <div className="fullContent">
            <h3>Conteúdo</h3>
            <textarea
              className="cardInputFull"
              placeholder="Campo de texto livre..."
              value={stateNoteItem?.content}
              onChange={(e) => handleTextAreaChange(e, 'content')}
            />
          </div>
          <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir nota?" onDataSend={handleDelete} deleteType />
          <NotesAddonsModal
            openModal={modalAddons}
            onClose={closeModal2}
            showtaskList={stateNoteItem.show_taskList || false}
            handleInputCheck={handleInputCheck}
          />
          {prjSettings.typeWriterSound && (<TypeWriterSound />)}
        </div>
      )}
    </div>
  );
}

export default NotesDetail;
