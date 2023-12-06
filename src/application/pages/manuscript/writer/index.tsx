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
      </div>
      <div className="writerContainter">
        <h1 className="writerTitle">
          <span className="ornament1" />
          {stateMItem.title}
          <span className="ornament2" />
        </h1>
        <div>
          <textarea
            className="writeArea"
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
