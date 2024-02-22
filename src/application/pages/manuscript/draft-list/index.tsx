import { SyntheticEvent, useEffect, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import './draft-list.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import manuscriptService from '../../../../service/manuscriptService';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import IManuscript from '../../../../interfaces/IManuscript';
import Loading from '../../../components/loading';
import GenericModal from '../../../components/generic-modal';
import utils from '../../../../service/utils';

function DraftList() {
  const [width, setWidth] = useState(600);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const charList = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.characters));
  const [cenesList, setCenesList] = useState<IManuscript[]>([]);
  const [filtredScenesList, setFiltredScenesList] = useState<IManuscript[]>([]);
  const [selectedPOV, setSelectedPOV] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [draftWC, setDraftWC] = useState(0);
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
        <label key={uuidv4()} htmlFor={cene.id.toString()} className="itemDraft">
          <div style={{ display: 'flex' }}>
            <input
              checked={cene.current}
              onChange={() => handleCheckboxChange(cene.id)}
              type="checkbox"
              id={cene.id.toString()}
              className="invisibleChk"
            />
            {prjSettings.manuscriptShowPovColor && (
              charList?.map((e) => e.id === cene.pov_id && (
                <span key={uuidv4()} className="charTagIcon" style={{ backgroundColor: e.color }} />
              ))
            )}
            <div className={cene.type === 'Cena' ? 'textIcon' : 'folderIcon'} />
            {cene.title || 'sem nome'}
            {prjSettings.manuscriptShowWC && cene.type === 'Cena' && (
              <span
                className="wordCountSpan"
                style={{ color: cene.current ? '#000000de' : '', marginLeft: '.5em' }}
              >
                {`(${utils.countWords(cene.content).toLocaleString()})`}
              </span>
            )}
            {prjSettings.manuscriptShowChecks && (
              renderChecks(cene.status)
            )}
            {cene.current && renderBtns()}
          </div>
          {prjSettings.manuscriptShowSynopsis && (
            <p
              style={{ color: cene.current ? '#000000de' : 'var(--text-color-inactive)', marginLeft: '2em' }}
            >
              {cene.resume}
            </p>
          )}
        </label>
      </div>
    ))
  );

  const renderSelectPOV = () => (
    <div>
      <select
        value={selectedPOV}
        onChange={(e) => setSelectedPOV(Number(e.target.value))}
        className="writeSelect"
        style={{ color: 'var(--text-color-inactive)' }}
      >
        <option value="">Filtro POV</option>
        {charList?.map((char) => (
          <option key={char.id} value={char.id}>
            •
            {' '}
            {char.title}
          </option>
        ))}
      </select>
    </div>
  );

  const renderSelectedStatus = () => (
    <div>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="writeSelect"
        style={{ color: 'var(--text-color-inactive)' }}
      >
        <option value="">Filtro Status</option>
        {prjSettings.manuscriptStatus?.map((status) => (
          <option key={uuidv4()} value={status}>
            •
            {' '}
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  const clearAllFilters = () => {
    setSelectedPOV(0);
    setSelectedStatus('');
  };

  useEffect(() => {
    if (projectData.data?.manuscript) {
      setCenesList(projectData.data.manuscript);
      setFiltredScenesList(projectData.data.manuscript);
    }
  }, [projectData.data?.manuscript]);

  useEffect(() => {
    const fetchData = () => {
      if (prjSettings) {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [prjSettings]);

  useEffect(() => {
    const current = cenesList.find((e) => e.current);
    if (current && current.id) {
      navigate(`/manuscript/${current.id}`);
      setSelectedItem(current.id);
    } else {
      navigate('/manuscript');
    }
  }, [cenesList, navigate]);

  useEffect(() => {
    const handleFilter = (scenesList: IManuscript[]) => {
      const result = scenesList.filter((scene) => {
        const PovMatch = !selectedPOV || scene.pov_id === selectedPOV;
        const statusMatch = !selectedStatus || scene.status?.includes(selectedStatus);
        return PovMatch && statusMatch;
      });
      setFiltredScenesList(result);
    };
    handleFilter(cenesList);
  }, [cenesList, selectedPOV, selectedStatus]);

  useEffect(() => {
    let totalWordCount = 0;
    filtredScenesList.forEach((cene) => {
      const amount = utils.countWords(cene.content);
      totalWordCount += amount;
    });
    setDraftWC(totalWordCount);
  }, [filtredScenesList]);

  return (
    <Resizable className="resizableDraftList" width={width} height={100} onResize={onResize} handle={<div className="custom-handle" />}>
      <div style={{ width: `${width}px`, height: 'auto' }}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            <div className="divBtnM">
              <div className="AddButtonsM">
                <button onClick={() => creatNewCene('Cena')} type="button" className="btnInvisibleM">+ Cena</button>
                <button onClick={() => creatNewCene('Capítulo')} type="button" className="btnInvisibleM">+ Capítulo</button>
              </div>
              <div className="moveButtonsM">
                <button onClick={moveUp} type="button" className="btnMoveInvisibleM">▲</button>
                <button onClick={moveDown} type="button" className="btnMoveInvisibleM">▼</button>
                <button onClick={() => moveLevel(false)} type="button" className="btnMoveInvisibleM">◀</button>
                <button onClick={() => moveLevel(true)} type="button" className="btnMoveInvisibleM">▶</button>
              </div>
            </div>
            <div className="listDraft">
              <div className="filterScene">
                {renderSelectPOV()}
                {renderSelectedStatus()}
                <button className="btnSmall" type="button" onClick={clearAllFilters}>✖ Limpar</button>
              </div>
              <h2>
                Rascunho
                {prjSettings.manuscriptShowWC && (
                  <span className="drafWC">{` (${draftWC.toLocaleString()})`}</span>
                )}
              </h2>
              <div style={{ overflow: 'auto' }}>
                {isLoading ? (
                  <Loading />
                ) : (
                  <div className="listDraftItens">
                    {cenesList && cenesList.length > 0 && renderCeneList(filtredScenesList)}
                  </div>
                )}
              </div>
            </div>
            <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir Cena? Ela foi modificada." onDataSend={handleDelete} deleteType />
          </div>
        )}
      </div>
    </Resizable>
  );
}

export default DraftList;
