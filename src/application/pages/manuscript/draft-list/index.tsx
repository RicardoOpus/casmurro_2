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

  const creatNewCene = async () => {
    await manuscriptService.createScene();
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

  const onResize = (
    _e: SyntheticEvent<Element, Event>,
    data: ResizeCallbackData,
  ) => {
    if (data.size && Number(data.size.width) > 60) {
      setWidth(data.size.width);
    }
  };

  const handleCheckboxChange = (item: number) => {
    setSelectedItem(item === selectedItem ? 0 : item);
  };

  const renderCeneList = (cenes: IManuscript[]) => (
    cenes.map((cene) => (
      <div key={cene.id} className="itemListM">
        <label htmlFor={cene.id.toString()}>
          <input
            checked={cene.id === selectedItem}
            onChange={() => handleCheckboxChange(cene.id)}
            type="checkbox"
            id={cene.id.toString()}
          />
          {cene.title}
          {' '}
          {cene.id}
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
        <div>
          <button onClick={creatNewCene} type="button" className="btnSmall">Add Filho</button>
          <button onClick={creatNewCene} type="button" className="btnSmall">Add Irmão</button>
        </div>
        <button onClick={moveUp} type="button" className="btnSmall">▲</button>
        <button onClick={moveDown} type="button" className="btnSmall">▼</button>
        <button onClick={deleteCene} className="btnSmall" type="button">
          <span className="ui-icon ui-icon-trash icon-color" />
          {' '}
          Excluir
        </button>
        <h2>Rascunho</h2>
        <div id="lista-tarefas">
          {cenesList && cenesList.length > 0 && renderCeneList(cenesList)}
        </div>
      </div>
    </Resizable>
  );
}

export default DraftList;
