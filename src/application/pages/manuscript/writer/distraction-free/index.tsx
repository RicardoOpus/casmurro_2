import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import './distractionFree.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import IrootStateProject from '../../../../../domain/IrootStateProject';
import IManuscript from '../../../../../domain/IManuscript';
import manuscriptService from '../../../../../service/manuscriptService';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
}

function DistractionFree({ onClose, openModal }: GenericModalProps) {
  const { id } = useParams();
  const manuscriptItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.manuscript));
  const currentMItem = manuscriptItens?.find((e) => e.id === Number(id));
  const [stateMItem,
    setStateManuItem] = useState<IManuscript | Partial<IManuscript>>({});
  const ref = useRef<HTMLDialogElement | null>(null);

  const setFullViewerScene = () => {
    const declaracaoCSS = false;
    const textArera = document.getElementById('textInput');
    if (textArera) {
      if (!declaracaoCSS) {
        const altura = window.innerHeight;
        const largura = window.innerWidth;
        textArera.style.height = `${altura * 0.8}px`;
        textArera.style.width = `${largura * 0.7}px`;
      } else {
        textArera.setAttribute('style', declaracaoCSS);
      }
    }
    window.scrollTo({ top: 0 });
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    const updatedState = { ...stateMItem, [key]: e.target.value, last_edit: Date.now() };
    setStateManuItem(updatedState);
    manuscriptService.upDate(Number(id), updatedState as IManuscript);
  };

  useEffect(() => {
    setFullViewerScene();
  }, [openModal]);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  useEffect(() => {
    if (currentMItem) {
      setStateManuItem(currentMItem);
    }
  }, [currentMItem, id]);

  return (
    <dialog ref={ref} className="distractionFree">
      <textarea
        id="textInput"
        className="writingArea"
        // style={{ fontFamily: stateFontUser, fontSize: stateSizeFontUser }}
        value={stateMItem?.content}
        onChange={(e) => handleTextAreaChange(e, 'content')}
        placeholder="Não iniciado..."
      />
      <div className="writingBtns">
        <button onClick={onClose} className="btnSmall" type="button">Fechar</button>
      </div>
    </dialog>
  );
}

export default DistractionFree;
