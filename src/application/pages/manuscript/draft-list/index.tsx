import { SyntheticEvent, useEffect, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import './draft-list.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import manuscriptService from '../../../../service/manuscriptService';
import IrootStateProject from '../../../../domain/IrootStateProject';
import IManuscript from '../../../../domain/IManuscript';
import Loading from '../../../components/loading';
import GenericModal from '../../../components/generic-modal';
import utils from '../../../../service/utils';

function DraftList() {
  const [width, setWidth] = useState(400);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const charList = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.characters));
  const [cenesList, setCenesList] = useState<IManuscript[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeModal = () => setModal(false);

  const creatNewCene = async (type: string) => {
    setIsLoading(true);
    await manuscriptService.createScene(selectedItem, type).then(() => setIsLoading(false));
    dispatch(fetchProjectDataAction(true));
  };

  const deleteCene = async () => {
    if (!selectedItem) return;
    const item = projectData.data?.manuscript?.find((e) => e.id === selectedItem);
    const sceneData = item;
    const hasData = (
      sceneData?.content
      || sceneData?.date
      || sceneData?.image
      || sceneData?.note
      || sceneData?.resume
      || (sceneData?.title && sceneData?.title !== 'Nova Cena')
    );
    if (hasData) {
      setModal(true);
    } else {
      await manuscriptService.deleteScene(selectedItem);
      dispatch(fetchProjectDataAction(true));
    }
  };

  const handleDelete = async () => {
    await manuscriptService.deleteScene(selectedItem);
    dispatch(fetchProjectDataAction(true));
  };

  const moveUp = async () => {
    await manuscriptService.UpScene(selectedItem);
    dispatch(fetchProjectDataAction(true));
  };

  const moveDown = async () => {
    await manuscriptService.DownScene(selectedItem);
    dispatch(fetchProjectDataAction(true));
  };

  const moveLevel = async (toIncrease: boolean) => {
    await manuscriptService.levelScene(selectedItem, toIncrease);
    dispatch(fetchProjectDataAction(true));
  };

  const handleCheckboxChange = async (item: number) => {
    setIsLoading(true);
    await manuscriptService.updateCurrent(item).then(() => setIsLoading(false));
    navigate(`/manuscript/${item}`);
    dispatch(fetchProjectDataAction(true));
    setSelectedItem(item === selectedItem ? 0 : item);
  };

  const onResize = (
    _e: SyntheticEvent<Element, Event>,
    data: ResizeCallbackData,
  ) => {
    if (data.size && Number(data.size.width) > 60) {
      setWidth(data.size.width);
    }
  };

  const renderBtns = () => (
    <span>
      <button onClick={deleteCene} className="btnInvisibleDel" type="button">✖</button>
    </span>
  );

  const renderChecks = (type: string | undefined) => {
    switch (type) {
      case 'Pronto':
        return (
          <span className="checkSceneList" style={{ color: 'var(--green-color)' }}>
            ✔
          </span>
        );
      case 'Revisado':
        return (
          <span className="checkSceneList" style={{ color: 'var(--green-color)' }}>
            ✔✔
          </span>
        );
      default:
        return (
          <div>
            <span />
          </div>
        );
    }
  };

  const renderCeneList = (cenes: IManuscript[]) => (
    cenes.map((cene) => (
      <div key={cene.id} style={{ marginLeft: `${cene.level_hierarchy}em` }} className={cene.current ? 'selected' : ''}>
        <label key={cene.id} htmlFor={cene.id.toString()} className="itemDraft">
          <input
            checked={cene.current}
            onChange={() => handleCheckboxChange(cene.id)}
            type="checkbox"
            id={cene.id.toString()}
            className="invisibleChk"
          />
          {prjSettings.manuscriptShowPovColor && (
            charList?.map((e) => e.id === cene.pov_id && (
              <span className="charTagIcon" style={{ backgroundColor: e.color }} />
            ))
          )}
          <div className={cene.type === 'Cena' ? 'textIcon' : 'folderIcon'} />
          {cene.title}
          {prjSettings.manuscriptShowWC && (
            <span
              className="wordCountSpan"
              style={{ color: cene.current ? '#000000de' : '', marginLeft: '.5em' }}
            >
              {`(${utils.countWords(cene.resume)})`}
            </span>
          )}
          {prjSettings.manuscriptShowChecks && (
            renderChecks(cene.status)
          )}
          {cene.current && renderBtns()}
        </label>
      </div>
    ))
  );

  useEffect(() => {
    if (projectData.data?.manuscript) {
      setCenesList(projectData.data.manuscript);
    }
  }, [projectData.data?.manuscript]);

  useEffect(() => {
    const current = cenesList.find((e) => e.current);
    if (current && current.id) {
      navigate(`/manuscript/${current.id}`);
      setSelectedItem(current.id);
    } else {
      navigate('/manuscript');
    }
  }, [cenesList, navigate]);

  return (
    <Resizable className="resizableDraftList" width={width} height={100} onResize={onResize} handle={<div className="custom-handle" />}>
      <div style={{ width: `${width}px`, height: 'auto' }}>
        <div className="divBtnM">
          <div className="AddButtonsM">
            <button onClick={() => creatNewCene('Cena')} type="button" className="btnInvisibleM">+ Cena</button>
            <button onClick={() => creatNewCene('Capítulo')} type="button" className="btnInvisibleM">+ Capítulo</button>
          </div>
          <div className="moveButtonsM">
            <button onClick={moveUp} type="button" className="btnMoveInvisibleM">▲</button>
            <button onClick={moveDown} type="button" className="btnMoveInvisibleM">▼</button>
            <button onClick={() => moveLevel(false)} type="button" className="btnMoveInvisibleM">🡰</button>
            <button onClick={() => moveLevel(true)} type="button" className="btnMoveInvisibleM">🡲</button>
          </div>
        </div>
        <div className="listDraft">
          <h2>Rascunho</h2>
          <div style={{ overflow: 'auto' }}>
            {isLoading ? (
              <Loading />
            ) : (
              <div className="listDraftItens">
                {cenesList && cenesList.length > 0 && renderCeneList(cenesList)}
              </div>
            )}
          </div>
        </div>
        <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir Cena? Ela foi modificada." onDataSend={handleDelete} deleteType />
      </div>
    </Resizable>
  );
}

export default DraftList;
