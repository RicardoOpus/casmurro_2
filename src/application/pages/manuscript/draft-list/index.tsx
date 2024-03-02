import { SyntheticEvent, useEffect, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
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
  const [width, setWidth] = useState(600);
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
      navigate(`/manuscript/${current.id}`);
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

  useEffect(() => {
    if (positionChagne) {
      manuscriptService.upDatePosition(scenesList);
      dispatch(fetchProjectDataAction(true));
      setPositionChange(false);
    }
  }, [dispatch, positionChagne, scenesList]);

  return (
    <Resizable className="resizableDraftList" width={width} height={100} onResize={onResize} handle={<div className="custom-handle" />}>
      <div style={{ width: `${width}px`, height: 'auto', minWidth: '300px' }}>
        {isLoading ? (
          <Loading />
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={changePosition}
            modifiers={[restrictToVerticalAxis]}
          >
            <div className="divBtnM">
              <div className="AddButtonsM">
                <button onClick={() => creatNewCene('Cena')} type="button" className="btnInvisibleM">+ Cena</button>
                <button onClick={() => creatNewCene('Capítulo')} type="button" className="btnInvisibleM">+ Capítulo</button>
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
                              handleCheckboxChange={handleCheckboxChange}
                              deleteCene={deleteCene}
                              hasFilter={isFilterClear}
                            />
                          ))
                        }
                      </SortableContext>
                    )}
                  </div>
                )}
              </div>
            </div>
            <GenericModal openModal={modal} onClose={closeModal} typeName="Excluir Cena? Ela foi modificada." onDataSend={handleDelete} deleteType />
          </DndContext>
        )}
      </div>
    </Resizable>
  );
}

export default DraftList;
