/* eslint-disable camelcase */
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import IrootStateProject from '../../../interfaces/IRootStateProject';
import IWorld from '../../../interfaces/IWorld';
import ICharacter from '../../../interfaces/ICharacter';
import IManuscript from '../../../interfaces/IManuscript';
import './timeline.css';
import utils from '../../../service/utils';
import ElapsedTimeModal from './elapsedtime-modal';

interface ValidDateItem extends Required<IManuscript>, Required<IWorld>, Required<ICharacter> {
  date: string;
  date_type: string;
}

function Timeline() {
  const [modal, setModal] = useState(false);
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const charList = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.characters));
  const [allCards, setAllCards] = useState<(ValidDateItem)[]>([]);
  const [filtredTimeline, setFiltredTimeline] = useState<(IWorld | ICharacter | IManuscript)[]>([]);
  const [selectedChar, setSelectedChar] = useState(0);
  const [isAscOrder, setIsAscOrdere] = useState(true);
  const navigate = useNavigate();

  const handleClick = (id: number, type: string) => {
    switch (type) {
      case 'Personagem':
        navigate(`/characters/${id}`);
        break;
      case 'Mundo':
        navigate(`/world/${id}`);
        break;
      case 'Cena':
        navigate(`/manuscript/${id}`);
        break;
      default:
        break;
    }
  };

  const renderItem = (item: ValidDateItem) => {
    switch (item.type) {
      case 'Personagem':
        return (
          <button onClick={() => handleClick(item.id, item.type)} className="btnInvisible timeline-section" style={{ padding: '0px 23px', width: '100%' }} type="button">
            <p style={{ background: `linear-gradient(to right, ${item.color} 0%, var(--bg-color) 25%)`, color: 'black' }}>{utils.convertDatePTBR(item.date)}</p>
            <p>{item.date_type === 'birth' ? `Nasce ${item.title}` : `Morre ${item.title}`}</p>
          </button>
        );
      default:
        return (
          <button onClick={() => handleClick(item.id, item.type)} className="btnInvisible timeline-section" style={{ padding: '0px 23px', width: '100%' }} type="button">
            <p style={{ backgroundColor: 'var(--bg-color)' }}>{utils.convertDatePTBR(item.date)}</p>
            <p>{item.title}</p>
            <p style={{ color: 'var(--text-color-inactive)' }}>{item.resume}</p>
          </button>
        );
    }
  };

  const renderSelectPOV = () => (
    <div>
      <select
        value={selectedChar}
        onChange={(e) => setSelectedChar(Number(e.target.value))}
        style={{ color: 'var(--text-color-inactive)' }}
      >
        <option value="">Personagem</option>
        {charList?.map((char) => (
          <option key={char.id} value={char.id}>
            •
            {' '}
            {char.title}
          </option>
        ))}
      </select>
    </div>
  );

  const clearAllFilters = () => {
    setSelectedChar(0);
  };

  const handleSort = () => {
    const sortedList = [...filtredTimeline].reverse();
    setFiltredTimeline(sortedList);
    setIsAscOrdere(!isAscOrder);
  };

  useEffect(() => {
    const handleFilter = () => {
      const result = allCards.filter((item) => {
        const CharacterMatch = !selectedChar || item.id === selectedChar
          || item.pov_id === selectedChar;
        return CharacterMatch;
      });
      if (!isAscOrder) {
        const sortedList = [...result].reverse();
        setFiltredTimeline(sortedList);
      } else {
        setFiltredTimeline(result);
      }
    };
    handleFilter();
  }, [allCards, isAscOrder, selectedChar]);

  useEffect(() => {
    const array1 = projectData.data?.manuscript?.filter((e) => e.date);
    const array2 = projectData.data?.world?.filter((e) => e.date);
    const charBirth = projectData.data?.characters?.filter((e) => e.date_birth);
    const array3 = charBirth?.map((scene) => {
      const { date_birth, ...restoDoObjeto } = scene;
      return { date: date_birth, date_type: 'birth', ...restoDoObjeto };
    });
    const charDeath = projectData.data?.characters?.filter((e) => e.date_death);
    const array4 = charDeath?.map((scene) => {
      const { date_death, ...restoDoObjeto } = scene;
      return { date: date_death, date_type: 'death', ...restoDoObjeto };
    });
    if (array1 && array2 && array3 && array4) {
      const newArray = [...array1, ...array2, ...array3, ...array4];
      if (newArray.length > 0) {
        newArray.sort((a, b) => {
          const dateA = new Date((a as ValidDateItem).date);
          const dateB = new Date((b as ValidDateItem).date);
          return dateA.getTime() - dateB.getTime();
        });
        setAllCards(newArray as ValidDateItem[]);
      }
    }
  }, [projectData.data?.characters, projectData.data?.manuscript, projectData.data?.world]);

  return (
    <div className="innerContent">
      <div className="card">
        <h1>Linha do tempo</h1>
        <div className="filterBar">
          {renderSelectPOV()}
          <button className="btnSmall" type="button" onClick={handleSort} disabled={isAscOrder}>↑</button>
          <button className="btnSmall" type="button" onClick={handleSort} disabled={!isAscOrder}>↓</button>
          <label className="deadlineIcon" htmlFor="timeElipsed">
            <button id="timeElipsed" className="btnInvisible" type="button" onClick={() => setModal(true)}>{ }</button>
          </label>
          <button className="btnSmall" type="button" onClick={clearAllFilters}>✖ Filtros</button>
        </div>
        <div className="containerTimeline">
          <div className="wrapper">
            <ul className="sessions">
              {filtredTimeline.map((e) => (
                <li key={uuidv4()}>
                  {renderItem(e as ValidDateItem)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ElapsedTimeModal
        openModal={modal}
        onClose={() => setModal(false)}
        timeline={allCards}
      />
    </div>
  );
}

export default Timeline;
