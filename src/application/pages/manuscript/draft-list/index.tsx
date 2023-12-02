import { SyntheticEvent, useEffect, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import './draft-list.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import manuscriptService from '../../../../service/manuscriptService';
import IrootStateProject from '../../../../domain/IrootStateProject';
import IManuscript from '../../../../domain/IManuscript';

function DraftList() {
  const [width, setWidth] = useState(300);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [cenesList, setCenesList] = useState<IManuscript[]>([]);
  const dispatch = useDispatch();

  const creatNewCene = async (type: string) => {
    await manuscriptService.createScene(selectedItem, type);
    dispatch(fetchProjectDataAction(true));
  };

  const deleteCene = async () => {
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
    await manuscriptService.updateCurrent(item);
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

  const renderCeneList = (cenes: IManuscript[]) => (
    cenes.map((cene) => (
      <div key={cene.id} style={{ marginLeft: `${cene.level_hierarchy}em` }} className={cene.current ? 'selected' : ''}>
        <label htmlFor={cene.id.toString()} className="itemDraft">
          <input
            checked={cene.current}
            onChange={() => handleCheckboxChange(cene.id)}
            type="checkbox"
            id={cene.id.toString()}
            className="invisibleChk"
          />
          <div className={cene.type === 'Cena' ? 'textIcon' : 'folderIcon'} />
          {cene.title}
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

  return (
    <Resizable className="resizableDraftList" width={width} height={100} onResize={onResize} handle={<div className="custom-handle" />}>
      <div style={{ width: `${width}px`, height: '100%' }}>
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
          <div>
            {cenesList && cenesList.length > 0 && renderCeneList(cenesList)}
          </div>
        </div>
      </div>
    </Resizable>
  );
}

export default DraftList;
