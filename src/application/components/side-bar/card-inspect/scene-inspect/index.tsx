import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IManuscript from '../../../../../interfaces/IManuscript';
import ICharacter from '../../../../../interfaces/ICharacter';
import IrootStateProject from '../../../../../interfaces/IRootStateProject';
import manuscriptService from '../../../../../service/manuscriptService';
import { fetchProjectDataAction } from '../../../../redux/actions/projectActions';
import IWorld from '../../../../../interfaces/IWorld';
import NewWindowInspect from '../new-window-inspect';

interface CardInspectProps {
  card: IManuscript;
  isNewWindow: boolean;
}

function SceneInspect({ card, isNewWindow }: CardInspectProps) {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [POV, setPOV] = useState<ICharacter[]>();
  const [world, setWorld] = useState<IWorld[]>([]);
  const [places, setPlaces] = useState<IWorld[]>([]);
  const [showNewWindow, setshowNewWindow] = useState(false);
  const [charactersInScene,
    setCharactersInScene] = useState<{
      charID: number;
      char: string; color: string;
    }[]>([]);

  const handleClick = async () => {
    await manuscriptService.updateCurrent(card.id);
    dispatch(fetchProjectDataAction(true));
    navigate(`/manuscript/${card.id}`);
  };

  useEffect(() => {
    if (projectData.data?.characters) {
      setCharacters(projectData.data.characters);
    }
  }, [projectData.data?.characters]);

  useEffect(() => {
    const pov = characters.filter((e) => e.id === card.pov_id);
    if (pov) {
      setPOV(pov);
    }
  }, [card.pov_id, characters]);

  useEffect(() => {
    if (projectData.data?.world) {
      const worldItens = projectData.data.world;
      setWorld(worldItens);
    }
  }, [projectData.data?.world]);

  useEffect(() => {
    const placeItem = world.filter((e) => e.id === Number(card.place));
    if (placeItem) {
      setPlaces(placeItem);
    }
  }, [card.place, world]);

  useEffect(() => {
    const relationsArray = card.scene_characters
      ?.reduce<{
        charID: number;
        char: string; color: string;
      }[]>((accumulator, e) => {
        const char = characters?.find((ele) => ele.id === e);
        if (char && char.color) {
          const newdata = {
            charID: char.id, char: char.title, color: char.color,
          };
          accumulator.push(newdata);
        }
        return accumulator;
      }, []);
    if (relationsArray) {
      setCharactersInScene(relationsArray);
    }
  }, [card.scene_characters, characters]);

  return (
    <div className="inspectCard">
      {showNewWindow && <NewWindowInspect card={card} />}
      <div className="imageInspect">
        {card.image && (
          <img className="imageInscpet" src={card.image} id="output" alt="character" />
        )}
      </div>
      <div className="inspectTitle">
        <button onClick={handleClick} className="btnInvisible" type="button">{card.title || 'sem nome'}</button>
        {isNewWindow && (
          <span className="tooltip-default" data-balloon aria-label="Abrir em uma nova janela" data-balloon-pos="down">
            <label className="multiWindowIcon" htmlFor="newWindowIcon">
              <button onClick={() => setshowNewWindow(true)} id="newWindowIcon" className="btnInvisible" type="button">{ }</button>
            </label>
          </span>
        )}
      </div>
      <div className="inspecInfos">
        {card.status ? <span>Status:</span> : ''}
        <p>{card.status}</p>
      </div>
      <div className="inspecInfos">
        {card.pov_id ? <span>POV:</span> : ''}
        {POV && (
          POV.map((e) => (
            <div key={uuidv4()}>
              <button onClick={() => navigate(`/characters/${e.id}`)} className="relationBtn" type="button" style={{ backgroundColor: e.color }}>{e.title}</button>
            </div>
          ))
        )}
      </div>
      <div className="inspecInfos">
        {card.place ? <span>Local:</span> : ''}
        {places && (
          places.map((e) => (
            <div key={uuidv4()}>
              <button onClick={() => navigate(`/world/${e.id}`)} className="btnInvisible" type="button">{e.title}</button>
            </div>
          ))
        )}
        {card.weather ? <span>Tempo:</span> : ''}
        <p>{card.weather}</p>
        {card.date ? <span>Data:</span> : ''}
        <p>{card.date}</p>
        {card.time ? <span>Hora:</span> : ''}
        <p>{card.time}</p>
        {card.goalWC ? <span>Meta de palavras:</span> : ''}
        <p>{card.goalWC}</p>
      </div>
      <div className="inspectCharRelations">
        {charactersInScene.length > 0 ? <span>Personagens em cena:</span> : ''}
        {charactersInScene.map((e) => (
          <div key={uuidv4()}>
            <button onClick={() => navigate(`/characters/${e.charID}`)} className="relationBtn" type="button" style={{ backgroundColor: e.color }}>{e.char}</button>
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
      {card.note ? <span>Notas:</span> : ''}
      {card.note && (
        <div dangerouslySetInnerHTML={{ __html: card.note }} />
      )}
      {card.content ? <span>Conteúdo:</span> : ''}
      {card.content && (
        <div dangerouslySetInnerHTML={{ __html: card.content }} />
      )}
    </div>
  );
}

export default SceneInspect;
