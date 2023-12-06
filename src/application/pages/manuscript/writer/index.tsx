import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import IManuscript from '../../../../domain/IManuscript';
import manuscriptService from '../../../../service/manuscriptService';
import utils from '../../../../service/utils';
import './writer.css';
import manuscriptColapseDetail from '../../../redux/actions/manuscriptActons';

function Writer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [colapseState, setColapseState] = useState(false);
  const typeSet = localStorage.getItem('sceneTypeFont') || 'Texgyretermes';
  const [typeFontUser, setTypeFontUSer] = useState(typeSet);
  const fontSizeSet = localStorage.getItem('sceneSize') || '25px';
  const [sizeFontUser, setSizeFontUser] = useState(fontSizeSet);
  const manuscriptItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.manuscript));
  const currentMItem = manuscriptItens?.find((e) => e.id === Number(id));
  const [stateMItem,
    setStateManuItem] = useState<IManuscript | Partial<IManuscript>>({});

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    const updatedState = { ...stateMItem, [key]: e.target.value, last_edit: Date.now() };
    setStateManuItem(updatedState);
    manuscriptService.upDate(Number(id), updatedState as IManuscript);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const adjustTextSize = (increaseStep: number, increase: boolean) => {
    const root = document.documentElement;
    const currentSizeInPixels = parseInt(fontSizeSet, 10);
    let newSizeInPixels;
    if (increase) {
      newSizeInPixels = currentSizeInPixels + increaseStep;
    } else {
      newSizeInPixels = currentSizeInPixels - increaseStep;
    }
    root.style.setProperty('--user-scene-size', `${newSizeInPixels}px`);
    localStorage.setItem('sceneSize', `${newSizeInPixels}px`);
    setSizeFontUser(`${newSizeInPixels}px`);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const root = document.documentElement;
    root.style.setProperty('--user-scene-type', e.target.value);
    localStorage.setItem('sceneTypeFont', e.target.value);
    setTypeFontUSer(e.target.value);
  };

  const colapeDetails = (colapse: boolean) => {
    dispatch(manuscriptColapseDetail(colapse));
    setColapseState(colapse);
  };

  useEffect(() => {
    utils.autoGrowAllTextareas();
  }, []);

  useEffect(() => {
    if (currentMItem) {
      setStateManuItem(currentMItem);
    }
  }, [currentMItem, id]);
  return (
    <div>
      <div className="writerButtons">
        {!colapseState ? (
          <button onClick={() => colapeDetails(true)} className="btnWriter" type="button">🡹</button>
        ) : (
          <button onClick={() => colapeDetails(false)} className="btnWriter" type="button">🡻</button>
        )}
        <button onClick={() => adjustTextSize(1, true)} className="btnSmall" type="button">+ A</button>
        <button onClick={() => adjustTextSize(1, false)} className="btnSmall" type="button">- A</button>
        <select
          className="ui-button ui-corner-all"
          onChange={(e) => handleSelectChange(e)}
          value={typeFontUser}
          style={{ color: 'var(--text-color-inactive)' }}
        >
          <option disabled>Tido da Fonte</option>
          <option value="Texgyretermes"> • Serifa</option>
          <option value="Roboto"> • Sem Serifa</option>
          <option value="TypeCurier"> • Mono</option>
        </select>
      </div>
      <div className="writerContainter">
        <h1 className="writerTitle" style={{ fontFamily: typeFontUser }}>
          <span className="ornament1" />
          {stateMItem.title}
          <span className="ornament2" />
        </h1>
        <div>
          <textarea
            className="writeArea"
            style={{ fontFamily: typeFontUser, fontSize: sizeFontUser }}
            value={stateMItem?.content}
            onChange={(e) => handleTextAreaChange(e, 'content')}
            placeholder="Não iniciado..."
          />
        </div>
      </div>
    </div>
  );
}

export default Writer;
