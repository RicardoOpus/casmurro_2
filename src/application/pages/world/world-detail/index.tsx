import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import ReactQuill from 'react-quill';
import BackButton from '../../../components/back-button';
import NextAndPrevCard from '../../../components/next-and-prev';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import IWorld from '../../../../interfaces/IWorld';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import GenericModal from '../../../components/generic-modal';
import utils from '../../../../service/utils';
import Loading from '../../../components/loading';
import WorldAddonsModal from '../world-addons';
import TaskList from '../../../components/task-list';
import ITaskList from '../../../../interfaces/ITaskList';
import worldService from '../../../../service/worldService';
import useTabReplacement from '../../../hooks/useTabReplacement';
import { modulesFull } from '../../../../templates/quillMudules';

function WorldDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [modalAddons, setModalAddons] = useState(false);
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleTextAreaChangeFull = (e: string, key: string) => {
    const updatedState = { ...stateWorldItem, [key]: e, last_edit: Date.now() };
    setStateWorldItem(updatedState);
    worldService.upDate(Number(id), updatedState as IWorld);
  };

  const updateCharacterTasks = (newtask: ITaskList[] | undefined) => {
    const updatedState = { ...stateWorldItem, task_list: newtask };
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

  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current) {
      const editingArea = quillRef.current.getEditingArea() as HTMLTextAreaElement;
      const distanceTop = editingArea.getBoundingClientRect().top;
      if (editingArea.firstChild) {
        (editingArea.firstChild as HTMLElement).style.maxHeight = `${window.innerHeight - distanceTop - 20}px`;
        (editingArea.firstChild as HTMLElement).style.minHeight = `${window.innerHeight - distanceTop - 20}px`;
      }
    }
  }, [stateWorldItem, id]);

  useTabReplacement(textareaRef, isLoading);

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
          {stateWorldItem.image && (
            <div className="imageCardBackgournd">
              <div className="cardImageDiv" style={{ backgroundImage: `url(${stateWorldItem.image})` }}>
                <img className="cardImage" src={stateWorldItem.image} id="output" alt="character" />
              </div>
            </div>
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
              {!stateWorldItem.image && (
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
              {stateWorldItem.image && (
                <span className="tooltip-default" data-balloon aria-label="Remover imagem" data-balloon-pos="down">
                  <label className="removeImage" htmlFor="removeImage">
                    <button id="removeImage" onClick={clearImage} className="btnInvisible" type="button">{ }</button>
                  </label>
                </span>
              )}
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
          {stateWorldItem.show_taskList && (
            <TaskList list={stateWorldItem.task_list} onDataSend={updateCharacterTasks} />
          )}
          <div className="fullContent">
            <h3>Resumo</h3>
            <textarea
              ref={textareaRef}
              className="cardInputFull"
              placeholder="Descreva de forma breve o item..."
              value={stateWorldItem?.resume}
              onChange={(e) => handleTextAreaChange(e, 'resume')}
            />
            <h3>Conteúdo</h3>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={stateWorldItem?.content}
              onChange={(e) => handleTextAreaChangeFull(e, 'content')}
              modules={modulesFull}
              placeholder="Campo de texto livre"
            />
          </div>
          <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir item mundo?" onDataSend={handleDelete} deleteType />
          <WorldAddonsModal
            openModal={modalAddons}
            onClose={closeModal2}
            showDate={stateWorldItem.show_date || false}
            showtaskList={stateWorldItem.show_taskList || false}
            handleInputCheck={handleInputCheck}
          />
        </div>
      )}
    </div>
  );
}

export default WorldDetail;
