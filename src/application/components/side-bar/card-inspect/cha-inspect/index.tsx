import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ICharacter from '../../../../../interfaces/ICharacter';
import IrootStateProject from '../../../../../interfaces/IRootStateProject';
import utils from '../../../../../service/utils';
import NewWindowInspect from '../new-window-inspect';

interface CardInspectProps {
  card: ICharacter;
  isNewWindow: boolean;
}

function CharInspect({ card, isNewWindow }: CardInspectProps) {
  const navigate = useNavigate();
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [showNewWindow, setshowNewWindow] = useState(false);
  const [stateRelations,
    setStateRelations] = useState<{
      charID: number;
      char: string; color: string; type: string;
    }[]>([]);

  useEffect(() => {
    if (projectData.data?.characters) {
      setCharacters(projectData.data.characters);
    }
  }, [projectData.data?.characters]);

  useEffect(() => {
    const relationsArray = card.relations
      ?.reduce<{
        charID: number;
        char: string; color: string; type: string;
      }[]>((accumulator, e) => {
        const char = characters?.find((ele) => ele.id === e.charID);
        if (char && char.color) {
          const newdata = {
            charID: char.id, char: char.title, color: char.color, type: e.type,
          };
          accumulator.push(newdata);
        }
        return accumulator;
      }, []);
    if (relationsArray) {
      setStateRelations(relationsArray);
    }
  }, [card.relations, characters]);

  return (
    <div className="inspectCard">
      {showNewWindow && <NewWindowInspect card={card} />}
      <div className="imageInspect">
        {card.image && (
          <img className="picInscpet" src={card.image} id="output" alt="character" />
        )}
      </div>
      <div className="inspectTitle">
        <span className="charTagIcon" style={{ backgroundColor: `${card.color || 'var(--text-color-sec)'}`, marginRight: '.5em' }} />
        <button onClick={() => navigate(`/characters/${card.id}`)} className="btnInvisible" type="button">{card.title}</button>
        {isNewWindow && (
          <span className="tooltip-default" data-balloon aria-label="Abrir em uma nova janela" data-balloon-pos="down">
            <label className="multiWindowIcon" htmlFor="newWindowIcon">
              <button onClick={() => setshowNewWindow(true)} id="newWindowIcon" className="btnInvisible" type="button">{ }</button>
            </label>
          </span>
        )}
      </div>
      <div className="inspecInfos">
        {card.full_name ? <span>Nome:</span> : ''}
        <p>{card.full_name}</p>
        {card.age ? <span>Idade:</span> : ''}
        <p>{card.age ? `${card.age} anos` : ''}</p>
        {card.gender ? <span>Gênero:</span> : ''}
        <p>{card.gender}</p>
        {card.category ? <span>Categoria:</span> : ''}
        <p>{card.category}</p>
        {card.occupation ? <span>Ocupação:</span> : ''}
        <p>{card.occupation}</p>
        {card.core_group ? <span>Núcleo:</span> : ''}
        <p>{card.core_group}</p>
        {card.date_birth ? <span>Nascimento:</span> : ''}
        <p>{utils.convertDatePTBR(card.date_birth)}</p>
        {card.date_death ? <span>Morte:</span> : ''}
        <p>{utils.convertDatePTBR(card.date_death)}</p>
      </div>
      <div className="inspectCharRelations">
        {stateRelations.length > 0 ? <span>Relacões:</span> : ''}
        {stateRelations.map((e) => (
          <div key={uuidv4()}>
            <span className="tooltip-default" data-balloon aria-label="Remover relação" data-balloon-pos="down">
              {' '}
            </span>
            <button onClick={() => navigate(`/characters/${e.charID}`)} className="relationBtn" type="button" style={{ backgroundColor: e.color }}>{e.char}</button>
            {' '}
            <span>{`(${e.type})`}</span>
          </div>
        ))}
      </div>
      <div className="inspectCharRelations">
        {card.task_list && card.task_list.length > 0 ? <span>Tarefas:</span> : ''}
        {card.task_list?.map((e) => (
          <div key={uuidv4()}>
            <p className={e.isDone ? 'doneTask spanTaskLit' : 'spanTaskLit'}>{`• ${e.task}`}</p>
          </div>
        ))}
      </div>
      {card.resume ? <span>Resumo:</span> : ''}
      <p className="PtextInfos">{card.resume}</p>
      {card.content ? <span>Conteúdo:</span> : ''}
      {card.content && (
        <div dangerouslySetInnerHTML={{ __html: card.content }} />
      )}
    </div>
  );
}

export default CharInspect;
