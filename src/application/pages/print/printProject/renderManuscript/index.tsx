import { v4 as uuidv4 } from 'uuid';
import IManuscript from '../../../../../interfaces/IManuscript';
import utils from '../../../../../service/utils';
import ICharacter from '../../../../../interfaces/ICharacter';
import IWorld from '../../../../../interfaces/IWorld';

const parseItalicText = (text: string) => (
  text.split(/\*([^*]+)\*/g).map((part, index) => (
    index % 2 === 0 ? (
      <span key={uuidv4()}>{part}</span>
    ) : (
      <em key={uuidv4()}>{part}</em>
    )
  ))
);

const creatParagraphs = (text: string) => {
  const myString = utils.substituirAspasCurvas(text);
  const paragraphs = myString.split('\n');
  return paragraphs.map((e, index) => (
    <p key={uuidv4()} className={index === 1 ? 'firstParagraph' : 'sceneP'}>
      {parseItalicText(e)}
    </p>
  ));
};

function renderManuscript(
  draft: IManuscript[],
  characters: ICharacter[] | undefined,
  places: IWorld[] | undefined,
) {
  return (
    <div>
      <h2 className="sectionTitle">MANUSCRITO</h2>
      <hr className="dividerPrint" />
      {draft.map((e) => (
        <div key={uuidv4()}>
          {e.type === 'Capítulo' && <h2>{e.title}</h2>}
          {e.type === 'Cena'
            && (
              <div key={uuidv4()}>
                <h3 style={{ margin: '1em 0' }} key={uuidv4()}>{e.title || 'Cena'}</h3>
                {e.image && (
                  <img className="imageCard" src={e.image} alt="Imagne do item" />
                )}
                {e.status && (
                  <h3 className="fontBold">
                    Status:
                    {' '}
                    <span>{e.status}</span>
                  </h3>
                )}
                {e.pov_id !== 0 && (
                  <h3 className="fontBold">
                    POV:
                    {' '}
                    <span>{characters?.find((ele) => ele.id === e.pov_id)?.title}</span>
                  </h3>
                )}
                {e.place !== 0 && (
                  <h3 className="fontBold">
                    Local:
                    {' '}
                    <span>{places?.find((ele) => ele.id === Number(e.place))?.title}</span>
                  </h3>
                )}
                {e.weather && (
                  <h3 className="fontBold">
                    Tempo:
                    {' '}
                    <span>{e.weather}</span>
                  </h3>
                )}
                {e.goalWC && (
                  <h3 className="fontBold">
                    Meta de palavras:
                    {' '}
                    <span>{e.goalWC}</span>
                  </h3>
                )}
                {e.date && (
                  <h3 className="fontBold">
                    Data:
                    {' '}
                    <span>{utils.convertDatePTBR(e.date)}</span>
                  </h3>
                )}
                {e.time && (
                  <h3 className="fontBold">
                    Hora:
                    {' '}
                    <span>{e.time}</span>
                  </h3>
                )}
                {e.task_list && e.task_list.length > 0 && (
                  <>
                    <h3 className="fontBold">Lista de Tarefas:</h3>
                    {e.task_list.map((item) => (
                      <li key={uuidv4()} style={{ textDecoration: item.isDone ? 'line-through' : '' }}>{item.task}</li>
                    ))}
                  </>
                )}
                {e.resume && (
                  <>
                    <h3 className="fontBold">Resumo:</h3>
                    <h3>{e.resume}</h3>
                  </>
                )}
                {e.note && (
                  <>
                    <h3 className="fontBold">Anotações:</h3>
                    <h3>{e.note}</h3>
                  </>
                )}
                {e.content && (
                  <>
                    <h3 className="fontBold">Cena:</h3>
                    {creatParagraphs(e.content)}
                  </>
                )}
              </div>
            )}
        </div>
      ))}
    </div>
  );
}

export default renderManuscript;
