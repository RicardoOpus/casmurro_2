import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import IManuscript from '../../../../domain/IManuscript';
import manuscriptService from '../../../../service/manuscriptService';
import utils from '../../../../service/utils';
import './writer.css';

function Writer() {
  const { id } = useParams();
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
        <button className="btnInvisibleM" type="button">Botão 1</button>
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
