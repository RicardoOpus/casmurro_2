/* eslint-disable camelcase */
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import IrootStateProject from '../../../interfaces/IRootStateProject';
import IWorld from '../../../interfaces/IWorld';
import ICharacter from '../../../interfaces/ICharacter';
import IManuscript from '../../../interfaces/IManuscript';
import './timeline.css';
import utils from '../../../service/utils';

interface ValidDateItem extends Required<IManuscript>, Required<IWorld>, Required<ICharacter> {
  date: string;
}

function Timeline() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [allCards, setAllCards] = useState<(IWorld | ICharacter | IManuscript)[]>([]);

  useEffect(() => {
    const array1 = projectData.data?.manuscript?.filter((e) => e.date);
    const array2 = projectData.data?.world?.filter((e) => e.date);
    const charBirth = projectData.data?.characters?.filter((e) => e.date_birth);
    const array3 = charBirth?.map((scene) => {
      const { date_birth, ...restoDoObjeto } = scene;
      return { date: date_birth, ...restoDoObjeto };
    });
    const charDeath = projectData.data?.characters?.filter((e) => e.date_death);
    const array4 = charDeath?.map((scene) => {
      const { date_death, ...restoDoObjeto } = scene;
      return { date: date_death, ...restoDoObjeto };
    });
    if (array1 && array2 && array3 && array4) {
      const newArray = [...array1, ...array2, ...array3, ...array4];
      if (newArray.length > 0) {
        newArray.sort((a, b) => {
          const dateA = new Date((a as ValidDateItem).date);
          const dateB = new Date((b as ValidDateItem).date);
          return dateA.getTime() - dateB.getTime();
        });
        setAllCards(newArray);
      }
    }
  }, [projectData.data?.characters, projectData.data?.manuscript, projectData.data?.world]);

  const renderItem = (item: ValidDateItem) => {
    switch (item.type) {
      case 'Personagem':
        return (
          <div className="timeline-section">
            <p style={{ background: `linear-gradient(to right, ${item.color} 0%, var(--bg-color) 25%)`, color: 'black' }}>{utils.convertDatePTBR(item.date)}</p>
            <p>{item.date_birth ? `Nasce ${item.title}` : `Morre ${item.title}`}</p>
          </div>
        );
      default:
        return (
          <div className="timeline-section">
            <p style={{ backgroundColor: 'var(--bg-color)' }}>{utils.convertDatePTBR(item.date)}</p>
            <p>{item.title}</p>
            <p style={{ color: 'var(--text-color-inactive)' }}>{item.resume}</p>
          </div>
        );
    }
  };

  return (
    <div className="innerContent">
      <div className="card">
        <h1>Timeline</h1>
        <div className="containerTimeline">
          <div className="wrapper">
            <ul className="sessions">
              {allCards.map((e) => (
                <li key={uuidv4()}>
                  {renderItem(e as ValidDateItem)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
