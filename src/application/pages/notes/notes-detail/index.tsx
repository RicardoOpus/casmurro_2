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
import './notes-detail.css';

function NotesDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [newTask, setNewtask] = useState('');
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

  const saveChecklistContent = () => {
    const list = document.getElementById('lista-tarefas');
    console.log('entrou aqui', list);

    if (list) {
      setStateNoteItem({ ...stateNoteItem, task_list: list.innerHTML, last_edit: Date.now() });
    }
  };

  const addNewTask = () => {
    const li = document.createElement('p');
    if (!newTask) {
      // eslint-disable-next-line no-alert
      return alert('Digite uma terefa!');
    }
    const textItem = `• ${newTask}`;
    const ol = document.getElementById('lista-tarefas');
    li.innerText = textItem;
    li.classList.add('task-list');
    if (ol) {
      ol.appendChild(li);
    }
    saveChecklistContent();
    return setNewtask('');
  };

  const sendDown = () => {
    const atual = document.querySelectorAll('.task-list');
    const proximo = document.querySelector('.selected');
    if (proximo) {
      for (let i = 0; i < atual.length - 1; i += 1) {
        const teste = atual[i].classList;
        if (teste.contains('selected')) {
          const proximoElemento = atual[i].nextSibling;
          const elemetoPai = atual[i].parentNode;
          if (proximoElemento && elemetoPai) {
            elemetoPai.insertBefore(proximoElemento, proximo);
          }
        }
      }
      saveChecklistContent();
    }
  };

  const sendUp = () => {
    const atual = document.querySelectorAll('.task-list');
    const proximo = document.querySelector('.selected');
    if (proximo) {
      for (let i = 1; i < atual.length; i += 1) {
        const teste = atual[i].classList;
        if (teste.contains('selected')) {
          const proximoElemento = atual[i].previousSibling;
          const elemetoPai = atual[i].parentNode;
          if (proximoElemento && elemetoPai) {
            elemetoPai.insertBefore(proximo, proximoElemento);
          }
        }
      }
      saveChecklistContent();
    }
  };

  const removeSelected = () => {
    const selectItem = document.getElementById('lista-tarefas');
    const liSecelt = document.querySelectorAll('.selected');
    if (selectItem) {
      for (let i = 0; i < liSecelt.length; i += 1) {
        selectItem.removeChild(liSecelt[i]);
      }
      saveChecklistContent();
    }
  };

  const clearAllDone = () => {
    const selectItem = document.getElementById('lista-tarefas');
    const liSecelt = document.querySelectorAll('.completed');
    if (selectItem) {
      for (let i = 0; i < liSecelt.length; i += 1) {
        selectItem.removeChild(liSecelt[i]);
      }
      saveChecklistContent();
    }
  };

  const clearAll = () => {
    const selectItem = document.getElementById('lista-tarefas');
    if (selectItem) {
      selectItem.innerHTML = '';
      saveChecklistContent();
    }
  };

  useEffect(() => {
    const selectTask = (event: MouseEvent) => {
      const element = event.target as HTMLElement;
      if (element) {
        const className = element.classList[0];
        if (className === 'selected') {
          element.classList.remove('selected');
        } else {
          const mouseClick = document.querySelectorAll('.selected');
          for (let i = 0; i < mouseClick.length; i += 1) {
            mouseClick[i].classList.remove('selected');
          }
          element.classList.add('selected');
          saveChecklistContent();
        }
      }
    };

    const taskDone = (event: MouseEvent) => {
      const element = event.target as HTMLElement;
      if (element) {
        const verify = element.classList.contains('completed');
        if (verify) {
          element.classList.remove('completed');
        } else {
          element.classList.add('completed');
        }
        saveChecklistContent();
      }
    };

    const selectItem = document.getElementById('lista-tarefas');
    if (selectItem && !isLoading) {
      selectItem.addEventListener('click', selectTask);
      selectItem.addEventListener('dblclick', taskDone);
    }
  }, [isLoading]);

  useEffect(() => {
    const selectItem = document.getElementById('lista-tarefas');
    if (selectItem && stateNoteItem.task_list && !isLoading) {
      selectItem.innerHTML = stateNoteItem.task_list;
    }
  }, [isLoading]);

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
          <input
            id="texto-tarefa"
            value={newTask}
            onChange={(e) => setNewtask(e.target.value)}
            className="cardInputNormal dateFactInputForm"
            type="text"
            placeholder="Digite uma tarefa... Clique duas vezes para riscá-la..."
          />
          <button className="btnSmall" onClick={addNewTask} type="button">Adicionar item</button>
          <button className="btnSmall" onClick={sendDown} type="button">▼</button>
          <button className="btnSmall" onClick={sendUp} type="button">▲</button>
          <button className="btnSmall" onClick={removeSelected} type="button">Remover Selecionado</button>
          <button className="btnSmall" onClick={clearAllDone} type="button">Limpar Finalizados</button>
          <button className="btnSmall" onClick={clearAll} type="button">Limpar Tudo</button>
          <div id="lista-tarefas" />
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
          {prjSettings.typeWriterSound && (<TypeWriterSound />)}
        </div>
      )}
    </div>
  );
}

export default NotesDetail;
