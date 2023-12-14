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

interface CardInspectProps {
  card: IManuscript;
}

function SceneInspect({ card }: CardInspectProps) {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [places, setPlaces] = useState<IWorld[]>([]);
  const [POV, setPOV] = useState<ICharacter[]>();
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
    if (projectData.data?.world) {
      const placesItens = projectData.data.world.filter((e) => e.category === 'Local');
      setPlaces(placesItens);
    }
  }, [projectData.data?.world]);

  useEffect(() => {
    const pov = characters.filter((e) => e.id === card.pov_id);
    if (pov) {
      setPOV(pov);
    }
  }, [card.pov_id, characters]);

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
      <div className="imageInspect">
        {card.image && (
          <img className="imageInscpet" src={card.image} id="output" alt="character" />
        )}
      </div>
      <div className="inspectTitle">
        <button onClick={handleClick} className="btnInvisible" type="button">{card.title || 'sem nome'}</button>
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
        {charactersInScene.length > 0 ? <span>Relacões:</span> : ''}
        {charactersInScene.map((e) => (
          <div key={uuidv4()}>
            <button onClick={() => navigate(`/characters/${e.charID}`)} className="relationBtn" type="button" style={{ backgroundColor: e.color }}>{e.char}</button>
          </div>
        ))}
      </div>
      <div className="inspectCharRelations">
        {card.link_list && card.link_list.length > 0 ? <span>Links:</span> : ''}
        {card.link_list?.map((e) => (
          <div key={uuidv4()}>
            <a href={e.URL} target="_blank" rel="noreferrer">{e.linkName}</a>
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
      <p className="PtextInfos">{card.note}</p>
      {card.content ? <span>Conteúdo:</span> : ''}
      <p className="PtextInfos">{card.content}</p>
    </div>
  );
}

export default SceneInspect;
