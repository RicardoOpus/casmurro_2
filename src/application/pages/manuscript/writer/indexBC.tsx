import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  ChangeEvent, useEffect, useState,
} from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import IManuscript from '../../../../domain/IManuscript';
import manuscriptService from '../../../../service/manuscriptService';
import utils from '../../../../service/utils';
import './writer.css';
import manuscriptColapseDetail from '../../../redux/actions/manuscriptActons';
import TimerModal from './timer-modal';
import TimerDisplay from './timer-display';
import adverbiosList from '../../../../templates/adverbiosList';
import clichesList from '../../../../templates/clichesList';
import pleonasmosList from '../../../../templates/pleonasmosList';

function Writer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [noDisctration, setnoDisctration] = useState(false);
  const [colapseState, setColapseState] = useState(false);
  const [countDown, setCountDown] = useState('99:99');
  const [categoryMark, setCategoryMark] = useState('');
  const [markWords, setmarkWords] = useState(['']);
  const [textHl, setTextHl] = useState('');
  const storagetypeFont = localStorage.getItem('sceneTypeFont') || 'PT';
  const [stateFontUser, setStateFontUSer] = useState(storagetypeFont);
  const storageFontSizeSet = localStorage.getItem('sceneSize') || '25px';
  const [stateSizeFontUser, setStateSizeFontUser] = useState(storageFontSizeSet);
  const storageColorScheme = localStorage.getItem('sceneColorScheme') || 'darkScene';
  const [stateColorScheme, setStateColorScheme] = useState(storageColorScheme);
  const storageColorHex = localStorage.getItem('sceneColorHex') || '#878787';
  const [stateColorHex, setStateColorHex] = useState(storageColorHex);
  const storagePaddingUser = localStorage.getItem('sceneArea') || '1';
  const [statePaddingUser, setstateWithUser] = useState(storagePaddingUser);
  const projectItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data));
  const manuscriptItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.manuscript));
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
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
    const currentSizeInPixels = parseInt(storageFontSizeSet, 10);
    let newSizeInPixels;
    if (increase) {
      newSizeInPixels = currentSizeInPixels + increaseStep;
    } else {
      newSizeInPixels = currentSizeInPixels - increaseStep;
    }
    root.style.setProperty('--user-scene-size', `${newSizeInPixels}px`);
    localStorage.setItem('sceneSize', `${newSizeInPixels}px`);
    setStateSizeFontUser(`${newSizeInPixels}px`);
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

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const root = document.documentElement;
    root.style.setProperty('--user-scene-type', e.target.value);
    localStorage.setItem('sceneTypeFont', e.target.value);
    setStateFontUSer(e.target.value);
  };

  const handleColoScheme = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'lightScene') {
      localStorage.setItem('sceneColorScheme', 'lightScene');
      localStorage.setItem('sceneColorHex', '#000000');
      setStateColorHex('#000000');
      setStateColorScheme(e.target.value);
    } if (e.target.value === 'sepiaScene') {
      localStorage.setItem('sceneColorScheme', 'sepiaScene');
      localStorage.setItem('sceneColorHex', '#5d4232');
      setStateColorHex('#5d4232');
      setStateColorScheme(e.target.value);
    } if (e.target.value === 'darkScene') {
      localStorage.setItem('sceneColorScheme', 'darkScene');
      localStorage.setItem('sceneColorHex', '#878787');
      setStateColorHex('#878787');
      setStateColorScheme(e.target.value);
    }
  };

  const handleDecoration = (type: string) => {
    switch (type) {
      case 'PT':
        return (<span className="ornament1" style={{ backgroundColor: stateColorHex }} />);
      case 'Roboto':
        return (<span style={{ marginRight: '.2em' }}>●</span>);
      case 'TypeCurier':
        return (<span style={{ marginRight: '.2em' }}>--</span>);
      default:
        return (<div><span /></div>);
    }
  };

  const handleDecoration2 = (type: string) => {
    switch (type) {
      case 'PT':
        return (<span className="ornament2" style={{ backgroundColor: stateColorHex }} />);
      case 'Roboto':
        return (<span style={{ marginLeft: '.2em' }}>●</span>);
      case 'TypeCurier':
        return (<span style={{ marginLeft: '.2em' }}>--</span>);
      default:
        return (<div><span /></div>);
    }
  };

  const distractionFreeMode = () => {
    setnoDisctration(!noDisctration);
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

  useEffect(() => {
    const content = stateMItem?.content;
    if (content) {
      let result;
      if (categoryMark === 'dialogos') {
        result = content.replace(/—([^—\n]+)—/g, (match) => `<mark class="markWordHL">${match}</mark>`);
        result = result.replace(/—([^\n]*)$/g, (match) => `<mark class="markWordHL">${match}</mark>`);
        result = result.replace(/^—([^\n]*)$/gm, (match) => `<mark class="markWordHL">${match}</mark>`);
      } else if (categoryMark === 'aspas') {
        result = content.replace(/"([^"\n]*\b[^"\n]*)"/g, (match) => `<mark class="markWordHL">${match}</mark>`);
      } else {
        result = markWords.reduce((acc, keyword) => {
          // const regexp = new RegExp(keyword, 'gi');
          const regexp = new RegExp(`\\b${keyword}\\b`, 'gi');
          return acc.replace(regexp, '<mark class="markWord">$&</mark>');
        }, content);
      }
      setTextHl(result);
    }
  }, [markWords, categoryMark, stateMItem]);

  const handleSelectMark = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'cards') {
      setCategoryMark('cards');
    } if (e.target.value === 'adv') {
      setCategoryMark('adv');
    } if (e.target.value === 'cliches') {
      setCategoryMark('cliches');
    } if (e.target.value === 'pleonasmos') {
      setCategoryMark('pleonasmos');
    } if (e.target.value === 'dialogos') {
      setCategoryMark('dialogos');
    } if (e.target.value === 'aspas') {
      setCategoryMark('aspas');
    } if (e.target.value === 'pessoal') {
      setCategoryMark('pessoal');
    } if (e.target.value === 'nothing') {
      setCategoryMark('nothing');
    }
  };

  useEffect(() => {
    if (categoryMark === 'cards') {
      if (projectItens) {
        let allTitles: string[] = [];
        if (projectItens.characters) {
          allTitles = [...allTitles, ...projectItens.characters.map((e) => e.title)];
        }
        if (projectItens.world) {
          allTitles = [...allTitles, ...projectItens.world.map((e) => e.title)];
        }
        setmarkWords(allTitles);
      }
    } if (categoryMark === 'adv') {
      setmarkWords(adverbiosList);
    } if (categoryMark === 'cliches') {
      setmarkWords(clichesList);
    } if (categoryMark === 'pleonasmos') {
      setmarkWords(pleonasmosList);
    } if (categoryMark === 'pessoal') {
      setmarkWords(prjSettings?.manuscriptPersonalWords);
    } if (categoryMark === 'nothing') {
      setmarkWords(['']);
    }
  }, [categoryMark, prjSettings?.manuscriptPersonalWords, projectItens]);

  useEffect(() => {
    utils.autoGrowAllTextareas();
  }, []);

  useEffect(() => {
    if (currentMItem) {
      setStateManuItem(currentMItem);
    }
  }, [currentMItem, id]);

  return (
    <div className={noDisctration ? 'distractionFree' : ''}>
      <div className="writerButtons">
        {!noDisctration && (
          !colapseState ? (
            <button onClick={() => colapeDetails(true)} className="btnWriter" type="button">🡹</button>
          ) : (
            <button onClick={() => colapeDetails(false)} className="btnWriter" type="button">🡻</button>
          )
        )}
        <button onClick={distractionFreeMode} className="distractionFreeIcon" type="button">{' '}</button>
        <button onClick={() => adjustTextSize(1, true)} className="btnWriter" type="button">+ A</button>
        <button onClick={() => adjustTextSize(1, false)} className="btnWriter" type="button">- A</button>
        {noDisctration && (
          <>
            <button onClick={() => adjustTextArea(true)} className="btnWriter" type="button">↔+</button>
            <button onClick={() => adjustTextArea(false)} className="btnWriter" type="button">↔-</button>
          </>
        )}
        <select
          className="ui-button ui-corner-all writeSelect"
          onChange={(e) => handleSelectChange(e)}
          value={stateFontUser}
          style={{ color: 'var(--text-color-inactive)' }}
        >
          <option disabled>Tido da Fonte</option>
          <option value="PT"> • Serifa</option>
          <option value="Roboto"> • Sem Serifa</option>
          <option value="TypeCurier"> • Mono</option>
        </select>
        <select
          className="ui-button ui-corner-all writeSelect"
          onChange={(e) => handleColoScheme(e)}
          value={stateColorScheme}
          style={{ color: 'var(--text-color-inactive)' }}
        >
          <option disabled>Esquema de cores</option>
          <option value="lightScene"> • Claro</option>
          <option value="sepiaScene"> • Sépia</option>
          <option value="darkScene"> • Escuro</option>
        </select>
        <select
          className="ui-button ui-corner-all writeSelect"
          value={categoryMark}
          onChange={(e) => handleSelectMark(e)}
          style={{ color: 'var(--text-color-inactive)' }}
        >
          <option disabled>Marcar palavras</option>
          <option value="nothing"> • Nenhuma</option>
          <option value="adv"> • Advérbios</option>
          <option value="cliches"> • Clichês</option>
          <option value="dialogos"> • Diálogos</option>
          <option value="aspas"> • Entre aspas</option>
          <option value="pessoal"> • Liata pessoal</option>
          <option value="cards"> • Personagens/Mundo</option>
          <option value="pleonasmos"> • Pleonasmos</option>
        </select>
        <button onClick={() => setModal(true)} className="timerIcon" type="button">{' '}</button>
      </div>
      <div className={`writerContainter ${stateColorScheme}`}>
        <h1 className="writerTitle" style={{ fontFamily: stateFontUser }}>
          {handleDecoration(stateFontUser)}
          {stateMItem.title}
          {handleDecoration2(stateFontUser)}
        </h1>
        <div style={{ padding: noDisctration ? `0 ${statePaddingUser}em` : '1em' }}>
          <div style={{ position: 'relative' }}>
            <div>
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: textHl }}
                className="writeArea"
                style={{
                  fontFamily: stateFontUser,
                  fontSize: stateSizeFontUser,
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  overflow: 'hidden',
                  color: 'transparent',
                  whiteSpace: 'pre-wrap',
                }}
              />
            </div>
            <textarea
              className="writeArea"
              style={{ fontFamily: stateFontUser, fontSize: stateSizeFontUser, position: 'relative' }}
              value={stateMItem?.content}
              onChange={(e) => handleTextAreaChange(e, 'content')}
              placeholder="Não iniciado..."
            />
          </div>
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
    </div>
  );
}

export default Writer;
