import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import IManuscript from '../../../../interfaces/IManuscript';
import manuscriptService from '../../../../service/manuscriptService';
import './writer.css';
import manuscriptColapseDetail from '../../../redux/actions/manuscriptActons';
import TimerModal from './timer-modal';
import TimerDisplay from './timer-display';
import utils from '../../../../service/utils';
import Alert from '../../../components/alert';
import TypeWriterSound from '../../../components/type-write-sound';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import { modulesOnlyText } from '../../../../templates/quillMudules';

function Writer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  // const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [noDisctration, setnoDisctration] = useState(false);
  const [colapseState, setColapseState] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [textHeight, settextHeight] = useState(0);
  const [wc, setWC] = useState(0);
  const [goalPercent, setGoalPercent] = useState('');
  const [countDown, setCountDown] = useState('99:99');
  const storagePaddingUser = localStorage.getItem('sceneArea') || '1';
  const uiMode = localStorage.getItem('uiMode') || 'dark';
  const [statePaddingUser, setstateWithUser] = useState(storagePaddingUser);
  const manuscriptItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.manuscript));
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const currentMItem = manuscriptItens?.find((e) => e.id === Number(id));
  const [stateMItem,
    setStateManuItem] = useState<IManuscript | Partial<IManuscript>>({});

  const handleTextAreaChangeFull = (e: string, key: string) => {
    const updatedState = { ...stateMItem, [key]: e, last_edit: Date.now() };
    setStateManuItem(updatedState);
    manuscriptService.upDate(Number(id), updatedState as IManuscript);
  };

  const adjustTextArea = (increase: boolean) => {
    let newSizeInPixels: number;
    if (increase) {
      newSizeInPixels = Number(statePaddingUser) + 1;
    } else {
      newSizeInPixels = Number(statePaddingUser) - 1;
      newSizeInPixels = Math.max(0, newSizeInPixels);
    }
    localStorage.setItem('sceneArea', newSizeInPixels.toString());
    setstateWithUser(newSizeInPixels.toString());
  };

  const distractionFreeMode = () => {
    setnoDisctration(!noDisctration);
    const { body } = document;
    const isInDistractionFreeMode = !body.style.overflow;
    body.style.overflow = isInDistractionFreeMode ? 'hidden' : '';
  };

  const colapeDetails = (colapse: boolean) => {
    dispatch(manuscriptColapseDetail(colapse));
    setColapseState(colapse);
  };

  const closeModal = () => {
    setModal(false);
    setCountDown('99:99');
  };

  const closeModalTimer = () => {
    setShowTimer(false);
    setCountDown('99:99');
  };

  const closeAlert = () => {
    setTimeout(() => {
      setShowAlert(false);
    }, 9000);
  };

  const goToBottom = () => {
    const end = document.getElementById('refEnd');
    if (end) {
      end.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const gotoTop = () => {
    const beginner = document.getElementById('refTop');
    if (beginner) {
      beginner.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goFullScreen = () => utils.toggleFullscreen();

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  useEffect(() => {
    const writeAreaHeight = document.getElementById('writeArea')?.clientHeight || 0;
    settextHeight(writeAreaHeight);
    if (writeAreaHeight > textHeight) {
      const textarea = document.getElementById('innerWriterContainer');
      if (textarea) {
        textarea.scrollBy(0, writeAreaHeight - textHeight);
      }
    }
  }, [stateMItem, textHeight]);

  useEffect(() => {
    if (stateMItem) {
      setWC(utils.countWords(stateMItem.content));
      if (stateMItem.goalWC !== '') {
        const goal = Number(stateMItem.goalWC);
        const percentage = Math.floor((wc / goal) * 100);
        setGoalPercent(` - ${percentage}%`);
        if (wc === goal) {
          setShowAlert(true);
          closeAlert();
        }
      }
    }
  }, [stateMItem, wc]);

  useEffect(() => {
    if (currentMItem) {
      setStateManuItem(currentMItem);
      setGoalPercent('');
      // setIsLoading(false);
    }
  }, [currentMItem, id]);

  return (
    currentMItem && currentMItem.type !== 'Capítulo' && (
      <div className={noDisctration ? 'distractionFree' : ''}>
        <div className="writerButtons">
          {!noDisctration && (
            !colapseState ? (
              <button title="Expandir" onClick={() => colapeDetails(true)} className="btnWriter" type="button">↑ ↑</button>
            ) : (
              <button title="Recolher" onClick={() => colapeDetails(false)} className="btnWriter" type="button">↓ ↓</button>
            )
          )}
          <button title="Modo sem distrações" onClick={distractionFreeMode} className="distractionFreeIcon" type="button">{' '}</button>
          {noDisctration && (
            <>
              <button title="Aumentar largura" onClick={() => adjustTextArea(true)} className="btnWriter" type="button">↔+</button>
              <button title="Diminuir largura" onClick={() => adjustTextArea(false)} className="btnWriter" type="button">↔-</button>
            </>
          )}
          <button title="Ir para topo" onClick={gotoTop} className="btnWriter" type="button">▲</button>
          <button title="Ir para final" onClick={goToBottom} className="btnWriter" type="button">▼</button>
          <button title="Modo tela cheia (F11)" onClick={goFullScreen} className="fullSceenIcon" type="button">{' '}</button>
          <button title="Temporizador" onClick={() => setModal(true)} className="timerIcon" type="button">{' '}</button>
          {wc > 0 && (
            <p style={{ color: 'var(--text-color-inactive)' }} title="Total de palavras">
              {stateMItem.goalWC && (
                <span>
                  {stateMItem.goalWC}
                  /
                </span>
              )}
              {wc}
              {goalPercent}
            </p>
          )}
        </div>
        <div id="innerWriterContainer" className={`writerContainter ${uiMode === 'dark' ? 'darkScene' : 'lightScene'}`} style={{ height: noDisctration ? '100%' : '' }}>
          <div className="innerWriterContainer" style={{ paddingLeft: noDisctration ? `${statePaddingUser}em` : '1em', paddingRight: noDisctration ? `${statePaddingUser}em` : '1em' }}>
            <div id="refTop" />
            <ReactQuill
              theme="snow"
              value={stateMItem?.content}
              onChange={(e) => handleTextAreaChangeFull(e, 'content')}
              modules={modulesOnlyText}
              placeholder="Campo de texto livre"
            />
            <div id="refEnd" />
          </div>
        </div>
        <TimerModal
          openModal={modal}
          showTimer={() => setShowTimer(true)}
          onClose={closeModal}
          updateTimer={(e) => setCountDown(e)}
        />
        {showTimer && (
          <TimerDisplay onClose={closeModalTimer} countDown={countDown} />
        )}
        {showAlert && (
          <Alert mensage="Meta batida!" />
        )}
        {prjSettings.typeWriterSound && (<TypeWriterSound />)}
      </div>
    )
  );
}

export default Writer;
