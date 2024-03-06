import { useEffect, useState } from 'react';
import './draft-list.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import manuscriptService from '../../../../service/manuscriptService';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import IManuscript from '../../../../interfaces/IManuscript';
import Loading from '../../../components/loading';
import GenericModal from '../../../components/generic-modal';
import utils from '../../../../service/utils';
import SortableScenes from './sortableScenes';

function DraftList() {
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const charList = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.characters));
  const [scenesList, setCenesList] = useState<IManuscript[]>([]);
  const [filtredScenesList, setFiltredScenesList] = useState<IManuscript[]>([]);
  const [selectedPOV, setSelectedPOV] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [positionChagne, setPositionChange] = useState(false);
  const [isFilterClear, setisFilterClear] = useState(true);
  const [showSceneView, setShowSceneView] = useState(false);
  const [draftWC, setDraftWC] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeModal = () => setModal(false);

  const creatNewCene = async (type: string) => {
    setIsLoading(true);
    await manuscriptService.createScene(type).then(() => setIsLoading(false));
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

  const handleClick = async (item: number) => {
    setShowSceneView(true);
    await manuscriptService.updateCurrent(item);
    setSelectedItem(item === selectedItem ? 0 : item);
    dispatch(fetchProjectDataAction(true));
  };

  const handleDoubleClick = async (item: number) => {
    await handleClick(item);
    navigate(`/manuscript/${item}`);
  };

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
    setisFilterClear(true);
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
    const current = scenesList.find((e) => e.current);
    if (current && current.id) {
      setSelectedItem(current.id);
    } else {
      navigate('/manuscript');
    }
  }, [scenesList, navigate]);

  useEffect(() => {
    const handleFilter = (sceneslist: IManuscript[]) => {
      const result = sceneslist.filter((scene) => {
        const PovMatch = !selectedPOV || scene.pov_id === selectedPOV;
        const statusMatch = !selectedStatus || scene.status?.includes(selectedStatus);
        return PovMatch && statusMatch;
      });
      setFiltredScenesList(result);
    };
    handleFilter(scenesList);
  }, [scenesList, selectedPOV, selectedStatus]);

  useEffect(() => {
    if (selectedPOV || selectedStatus) {
      setisFilterClear(false);
    }
  }, [selectedPOV, selectedStatus]);

  useEffect(() => {
    let totalWordCount = 0;
    filtredScenesList.forEach((cene) => {
      const amount = utils.countWords(cene.content);
      totalWordCount += amount;
    });
    setDraftWC(totalWordCount);
  }, [filtredScenesList]);

  const changePosition = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const activeIndex = filtredScenesList.findIndex((item) => item.id === active.id);
      const overIndex = filtredScenesList.findIndex((item) => item.id === over.id);
      if (activeIndex !== -1 && overIndex !== -1 && active.id !== over.id) {
        setCenesList((items) => {
          const newItems = arrayMove(items, activeIndex, overIndex);
          return [...newItems];
        });
        setPositionChange(true);
      }
    }
  };

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupFunction, []);

  useEffect(() => {
    if (positionChagne) {
      manuscriptService.upDatePosition(scenesList);
      setPositionChange(false);
    }
  }, [dispatch, positionChagne, scenesList]);

  return (
    <div className="resizableDraftList">
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={changePosition}
            modifiers={[restrictToVerticalAxis]}
          >
            <div className="listDraft">
              <div className="createNewManuBtns">
                <button onClick={() => creatNewCene('Cena')} type="button" className="btnMedium">+ Cena</button>
                <button onClick={() => creatNewCene('Capítulo')} type="button" className="btnMedium">+ Capítulo</button>
              </div>
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
                  <div style={{ display: 'flex' }}>
                    <div className="listDraftItens" style={{ width: '100%' }}>
                      {scenesList && scenesList.length > 0 && (
                        <SortableContext
                          items={filtredScenesList}
                          strategy={verticalListSortingStrategy}
                        >
                          {
                            filtredScenesList.map((scene) => (
                              <SortableScenes
                                id={scene.id}
                                current={scene.current}
                                manuscriptShowPovColor={prjSettings.manuscriptShowPovColor}
                                charList={charList}
                                povId={scene.pov_id}
                                type={scene.type}
                                title={scene.title}
                                manuscriptShowWC={prjSettings.manuscriptShowWC}
                                content={scene.content}
                                manuscriptShowChecks={prjSettings.manuscriptShowChecks}
                                status={scene.status}
                                manuscriptShowSynopsis={prjSettings.manuscriptShowSynopsis}
                                resume={scene.resume}
                                handleClick={handleClick}
                                handleDoubleClick={handleDoubleClick}
                                deleteCene={deleteCene}
                                hasFilter={isFilterClear}
                                key={scene.id}
                              />
                            ))
                          }
                        </SortableContext>
                      )}
                    </div>
                    {showSceneView && filtredScenesList.some((e) => e.current === true) && (
                      <div style={{ width: '100%' }}>
                        {filtredScenesList.filter((e) => e.current === true).map((e) => (
                          <div className="SceneView">
                            {
                              e.content ? (
                                <p dangerouslySetInnerHTML={{ __html: e.content }} />
                              ) : (
                                <span>Sem conteúdo</span>
                              )
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir Cena? Ela foi modificada." onDataSend={handleDelete} deleteType />
          </DndContext>
        )}
      </div>
    </div>
  );
}

export default DraftList;
