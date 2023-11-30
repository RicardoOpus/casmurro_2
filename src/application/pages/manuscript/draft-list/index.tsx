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
  const [selectedItemPath, setSelectedItemPath] = useState('0');
  const [selectedItemID, setSelectedItemID] = useState(0);
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [cenesList, setCenesList] = useState<IManuscript[]>([]);
  const dispatch = useDispatch();

  const creatNewCene = async (position: string) => {
    if (selectedItemPath === '0') {
      await manuscriptService.createScene(selectedItemPath, 'default');
    } else {
      await manuscriptService.createScene(selectedItemPath, position);
    }
    dispatch(fetchProjectDataAction(true));
  };

  const deleteCene = async () => {
    await manuscriptService.deleteScene(selectedItemID, selectedItemPath);
    dispatch(fetchProjectDataAction(true));
  };

  const moveUp = async () => {
    await manuscriptService.UpScene(selectedItemID, selectedItemPath);
    dispatch(fetchProjectDataAction(true));
  };

  const moveDown = async () => {
    await manuscriptService.DownScene(selectedItemID, selectedItemPath);
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

  const handleCheckboxChange = (item: string, ID: number) => {
    setSelectedItemPath(item === selectedItemPath ? '' : item);
    setSelectedItemID(ID);
  };

  const renderCeneList = (cenes: IManuscript[], path: number[] = []) => (
    cenes.map((cene) => (
      <div key={cene.id} className="itemListM">
        <label htmlFor={[...path, cene.id].join('-')}>
          <input
            checked={[...path, cene.id].join('-') === selectedItemPath}
            onChange={() => handleCheckboxChange([...path, cene.id].join('-'), cene.id)}
            type="checkbox"
            id={[...path, cene.id].join('-')}
          />
          {cene.title}
          {' '}
          {cene.id}
        </label>
        {cene.children && cene.children.length > 0
          && renderCeneList(cene.children, [...path, cene.id])}
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
        <button onClick={() => creatNewCene('child')} type="button" className="btnSmall">Add Filho</button>
        <button onClick={() => creatNewCene('sibling')} type="button" className="btnSmall">Add Irmão</button>
        <button onClick={moveUp} type="button" className="btnSmall">▲ Send Up</button>
        <button onClick={moveDown} type="button" className="btnSmall">▼ Send Donw</button>
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
