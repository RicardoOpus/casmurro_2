import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import BackButton from '../../../components/back-button';
import NextAndPrevCard from '../../../components/next-and-prev';
import IrootStateProject from '../../../../domain/IrootStateProject';
import IWorld from '../../../../domain/worldModel';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import GenericModal from '../../../components/generic-modal';
import TypeWriterSound from '../../../components/type-write-sound';
import utils from '../../../../service/utils';
import Loading from '../../../components/loading';

function WorldDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const worldItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.world));
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const { id } = useParams();
  const currentWorldItem = worldItens?.find((e) => e.id === Number(id));
  const [stateWorldItem,
    setStateWorldItem] = useState<IWorld | Partial<IWorld>>(currentWorldItem || {});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const now = Date.now();
    setStateWorldItem({ ...stateWorldItem, [key]: e.target.value, last_edit: now });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    const now = Date.now();
    setStateWorldItem({ ...stateWorldItem, [key]: e.target.value, last_edit: now });
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    const now = Date.now();
    setStateWorldItem({ ...stateWorldItem, [key]: e.target.value, last_edit: now });
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const callBackLoading = () => {
    setIsLoading(true);
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleDelete = async () => {
    await indexedDBrepository.deleteCard(Number(id), 'world');
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
        setStateWorldItem({ ...stateWorldItem, image: base64String.toString() });
      }
    }
  };

  const clearImage = () => {
    setStateWorldItem({ ...stateWorldItem, image: '' });
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
    const fetchData = async () => {
      if (Object.keys(stateWorldItem).length === 0) {
        navigate('/');
      } if (!isLoading) {
        await indexedDBrepository.worldUpdate(Number(id), stateWorldItem as IWorld);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, stateWorldItem, id, navigate, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      utils.autoGrowAllTextareas();
    }
  }, [isLoading]);

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
              <div className="profile-pic">
                <label className="-label2" htmlFor="file">
                  + imagem
                  <input id="file" type="file" accept=".jpg, jpeg, .png" onChange={(e) => handleFileInput(e.target)} />
                </label>
              </div>
              <button onClick={clearImage} className="btnSmall" type="button">✖ imagem</button>
            </div>
            <div className="detailBarButtonsItens">
              <button onClick={openModal} className="btnSmall" type="button">
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
                  <option key={e} value={e}>
                    •
                    {' '}
                    {e}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="fullContent">
            <h3>Resumo</h3>
            <textarea
              className="cardInputFull"
              placeholder="Descreva de forma breve quem é essa personagem..."
              value={stateWorldItem?.resume}
              onChange={(e) => handleTextAreaChange(e, 'resume')}
            />
            <h3>Anotações</h3>
            <textarea
              className="cardInputFull"
              placeholder="Lembretes, ideias, problemas, apontamentos, reflexões..."
              value={stateWorldItem?.note}
              onChange={(e) => handleTextAreaChange(e, 'note')}
            />
            <h3>Conteúdo</h3>
            <textarea
              className="cardInputFull"
              placeholder="Campo de texto livre..."
              value={stateWorldItem?.content}
              onChange={(e) => handleTextAreaChange(e, 'content')}
            />
          </div>
          <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir item mundo?" onDataSend={handleDelete} deleteType />
          {prjSettings.typeWriterSound && (<TypeWriterSound />)}
        </div>
      )}
    </div>
  );
}

export default WorldDetail;
