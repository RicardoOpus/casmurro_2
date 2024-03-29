import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import IManuscript from '../../../../interfaces/IManuscript';
import manuscriptService from '../../../../service/manuscriptService';
import './writer.css';
import TimerModal from './timer-modal';
import TimerDisplay from './timer-display';
import utils from '../../../../service/utils';
import Alert from '../../../components/alert';
import TypeWriterSound from '../../../components/type-write-sound';
import { modulesOnlyText } from '../../../../templates/quillMudules';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import BackButton from '../../../components/back-button';
import ISnapshots from '../../../../interfaces/ISnapshots';

function Writer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [noDisctration, setnoDisctration] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSnap, setShowAlertSnap] = useState(false);
  const [textHeight, settextHeight] = useState(0);
  const [wc, setWC] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [goalPercent, setGoalPercent] = useState('');
  const [countDown, setCountDown] = useState('99:99');
  const uiMode = localStorage.getItem('uiMode') || 'dark';
  const storagePaddingUser = localStorage.getItem('sceneArea') || '1';
  const [statePaddingUser, setstateWithUser] = useState(storagePaddingUser);
  const storageZoomUser = localStorage.getItem('zoomArea') || '16';
  const [stateZoomUser, setstateZoomUser] = useState(storageZoomUser);
  const manuscriptItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.manuscript));
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const currentMItem = manuscriptItens?.find((e) => e.id === Number(id));
  const [stateMItem,
    setStateManuItem] = useState<IManuscript | Partial<IManuscript>>({});

  const handleTextAreaChangeFull = (e: string, key: string) => {
    if (stateMItem.id === Number(id)) {
      const updatedValue = e.replace(/--/g, '—');
      const updatedState = { ...stateMItem, [key]: updatedValue, last_edit: Date.now() };
      setStateManuItem(updatedState);
      manuscriptService.upDate(stateMItem.id, updatedState as IManuscript);
    }
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

  const adjustZoomTextArea = (increase: boolean) => {
    let newZoom: number;
    if (increase) {
      newZoom = Number(stateZoomUser) + 1;
    } else {
      newZoom = Number(stateZoomUser) - 1;
      newZoom = Math.max(0, newZoom);
    }
    localStorage.setItem('zoomArea', newZoom.toString());
    setstateZoomUser(newZoom.toString());
  };

  const distractionFreeMode = () => {
    setnoDisctration(!noDisctration);
    const { body } = document;
    const isInDistractionFreeMode = !body.style.overflow;
    body.style.overflow = isInDistractionFreeMode ? 'hidden' : '';
  };

  const colapeDetails = () => {
    if (currentMItem) {
      navigate(`/draftDetail/${currentMItem.id}`);
    }
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
      setShowAlertSnap(false);
    }, 9000);
  };

  const goFullScreen = () => utils.toggleFullscreen();
  const quillRef = useRef<ReactQuill>(null);

  const goToBottom = () => {
    if (quillRef.current) {
      const editingArea = quillRef.current.getEditor().root;
      const writeAreaHeight = editingArea?.scrollHeight || 0;
      if (writeAreaHeight) {
        const editingAreaContent = quillRef.current.getEditingArea() as HTMLTextAreaElement;
        if (editingAreaContent) {
          editingArea.scrollTo({
            top: writeAreaHeight,
            behavior: 'smooth',
          });
        }
      }
    }
  };

  const gotoTop = () => {
    if (quillRef.current) {
      const editingArea = quillRef.current.getEditor().root;
      editingArea.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const takeSnapshot = () => {
    if (stateMItem.id) {
      const newSnapshot: ISnapshots = { text: stateMItem?.content || '', createdAt: Date.now() };
      const updatedSnapshots = [...stateMItem.snapshots || [], newSnapshot];
      const updatedState = { ...stateMItem, snapshots: updatedSnapshots };
      setStateManuItem(updatedState);
      manuscriptService.upDate(stateMItem.id, updatedState as IManuscript);
      setShowAlertSnap(true);
      closeAlert();
    }
  };

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupFunction, []);

  useEffect(() => {
    const fontSize = localStorage.getItem('contenSize');
    if (noDisctration) {
      document.documentElement.style.setProperty('--user-text-size', `${stateZoomUser}px`);
    } else {
      document.documentElement.style.setProperty('--user-text-size', fontSize);
    }
  }, [noDisctration, stateZoomUser]);

  useEffect(() => {
    if (quillRef.current) {
      const editingArea = quillRef.current.getEditor().root;
      const writeAreaHeight = editingArea?.scrollHeight || 0;
      settextHeight(writeAreaHeight);
      if (writeAreaHeight > textHeight) {
        const editingAreaContent = quillRef.current.getEditingArea() as HTMLTextAreaElement;
        if (editingAreaContent) {
          editingArea.scrollBy(0, writeAreaHeight - textHeight);
        }
      }
    }
  }, [stateMItem, textHeight]);

  useEffect(() => {
    if (quillRef.current) {
      const editingArea = quillRef.current.getEditingArea() as HTMLTextAreaElement;
      const distanceTop = editingArea.getBoundingClientRect().top;
      if (editingArea.firstChild) {
        (editingArea.firstChild as HTMLElement).style.maxHeight = `${window.innerHeight - distanceTop - 20}px`;
        (editingArea.firstChild as HTMLElement).style.minHeight = `${window.innerHeight - distanceTop - 20}px`;
      }
    }
  }, [stateMItem, id, noDisctration]);

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
    }
  }, [currentMItem, id]);

  useEffect(() => {
    if (prjSettings.manuscriptShowWcSteps) {
      if (wc > 0 && wc % prjSettings.manuscriptWcSteps === 1 && wc !== 1) {
        setShowSteps(true);
        setTimeout(() => {
          setShowSteps(false);
        }, 3000);
      }
    }
  }, [prjSettings.manuscriptShowWcSteps, prjSettings.manuscriptWcSteps, wc]);

  return (
    currentMItem ? (
      <div className={noDisctration ? 'distractionFree' : ''} style={{ width: '100%' }}>
        <div className="writerButtons">
          <BackButton path="/manuscript" callback={cleanupFunction} />
          {!noDisctration && (
            <button title="Expandir" onClick={colapeDetails} className="btnWriter" type="button">Mostrar detalhes</button>
          )}
          <button title="Modo sem distrações" onClick={distractionFreeMode} className="distractionFreeIcon" type="button">{' '}</button>
          {noDisctration && (
            <>
              <button title="Aumentar largura" onClick={() => adjustTextArea(true)} className="btnWriter" type="button">↔+</button>
              <button title="Diminuir largura" onClick={() => adjustTextArea(false)} className="btnWriter" type="button">↔-</button>
              <button title="Aumentar zoom" onClick={() => adjustZoomTextArea(true)} className="btnWriter" type="button">A+</button>
              <button title="Diminuir zoom" onClick={() => adjustZoomTextArea(false)} className="btnWriter" type="button">A-</button>
            </>
          )}
          <button title="Ir para topo" onClick={gotoTop} className="btnWriter" type="button">▲</button>
          <button title="Ir para final" onClick={goToBottom} className="btnWriter" type="button">▼</button>
          <button title="Modo tela cheia (F11)" onClick={goFullScreen} className="fullSceenIcon" type="button">{' '}</button>
          <button title="Temporizador" onClick={() => setModal(true)} className="timerIcon" type="button">{' '}</button>
          <button title="Criar um instantâneo" onClick={takeSnapshot} className="cameraIcon" type="button">{' '}</button>
          {wc > 0 && (
            <p style={{ color: 'var(--text-color-inactive)' }} title="Total de palavras">
              {wc}
              {stateMItem.goalWC && (
                <span>
                  /
                  {stateMItem.goalWC}
                </span>
              )}
              {goalPercent}
            </p>
          )}
        </div>
        {currentMItem.type === 'Cena' && (
          <div
            id="innerWriterContainer"
            className={`writerContainter ${uiMode === 'dark' ? 'darkScene' : 'lightScene'}`}
            style={{ height: noDisctration ? '100%' : '' }}
          >
            {showSteps && (
              <div className="damage-effect" id="damageEffect">
                +
                {prjSettings.manuscriptWcSteps}
              </div>
            )}
            <div className="innerWriterContainer" style={{ paddingLeft: noDisctration ? `${statePaddingUser}em` : '1em', paddingRight: noDisctration ? `${statePaddingUser}em` : '1em' }}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={stateMItem?.content}
                onChange={(e) => handleTextAreaChangeFull(e, 'content')}
                modules={modulesOnlyText}
                placeholder="Cena não iniciada..."
              />
            </div>
          </div>
        )}
        <TimerModal
          openModal={modal}
          showTimer={() => setShowTimer(true)}
          onClose={closeModal}
          updateTimer={(e) => setCountDown(e)}
        />
        {showTimer && (
          <TimerDisplay onClose={closeModalTimer} countDown={countDown} />
        )}
        {showAlert && <Alert mensage="Meta batida!" />}
        {showAlertSnap && <Alert mensage="Instantâneo criado!" />}
        {prjSettings.typeWriterSound && (<TypeWriterSound />)}
      </div>
    ) : (
      <div style={{ width: '100%' }}>
        <div className="writerButtons">
          <button title="Expandir" onClick={colapeDetails} className="btnWriter" type="button">Mostrar detalhes</button>
        </div>
        <div style={{ margin: '1em' }}>
          <h2>{stateMItem.title}</h2>
        </div>
      </div>
    )
  );
}

export default Writer;
