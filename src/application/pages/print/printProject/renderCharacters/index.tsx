/* eslint-disable react/destructuring-assignment */
import { v4 as uuidv4 } from 'uuid';
import ICharacter from '../../../../../interfaces/ICharacter';
import utils from '../../../../../service/utils';

function RenderCharacters(charactersList: ICharacter[]) {
  return (
    <div>
      <h2 className="sectionTitle">PERSONAGENS</h2>
      <hr className="dividerPrint" />
      {charactersList && (
        charactersList.map((ch) => (
          <div key={ch.id}>
            <h2>{ch.title}</h2>
            {ch.image && (
              <img className="charaterPrintImage" src={ch.image} alt="Imagne do personagem" />
            )}
            {ch.full_name && (
              <h3 className="fontBold">
                Nome completo:
                {' '}
                <span>{ch.full_name}</span>
              </h3>
            )}
            {ch.category && (
              <h3 className="fontBold">
                Categoria:
                {' '}
                <span>{ch.category}</span>
              </h3>
            )}
            {ch.gender && (
              <h3 className="fontBold">
                Gênero:
                {' '}
                <span>{ch.gender}</span>
              </h3>
            )}
            {ch.age && (
              <h3 className="fontBold">
                Idade:
                {' '}
                <span>{ch.age}</span>
              </h3>
            )}
            {ch.occupation && (
              <h3 className="fontBold">
                Ocupação:
                {' '}
                <span>{ch.occupation}</span>
              </h3>
            )}
            {ch.date_birth && (
              <h3 className="fontBold">
                Data Nascimento:
                {' '}
                <span>{utils.convertDatePTBR(ch.date_birth)}</span>
              </h3>
            )}
            {ch.date_death && (
              <h3 className="fontBold">
                Data de morte:
                {' '}
                <span>{utils.convertDatePTBR(ch.date_death)}</span>
              </h3>
            )}
            {ch.core_group && (
              <h3 className="fontBold">
                Núcleo:
                {' '}
                <span>{ch.core_group}</span>
              </h3>
            )}
            {ch.relations && ch.relations.length > 0 && (
              <>
                <h3 className="fontBold">Relações:</h3>
                {ch.relations.map((charID) => (
                  <li key={uuidv4()}>
                    {charactersList.find((e) => e.id === charID.charID)?.title}
                    {' '}
                    <span key={uuidv4()}>
                      (
                      {charID.type}
                      )
                    </span>
                  </li>
                ))}
              </>
            )}
            {ch.task_list && ch.task_list.length > 0 && (
              <>
                <h3 className="fontBold">Lista de Tarefas:</h3>
                {ch.task_list.map((item) => (
                  <li key={uuidv4()} style={{ textDecoration: item.isDone ? 'line-through' : '' }}>{item.task}</li>
                ))}
              </>
            )}
            {ch.resume && (
              <>
                <h3 className="fontBold">Resumo:</h3>
                <h3>{ch.resume}</h3>
              </>
            )}
            {ch.content && (
              <>
                <h3 className="fontBold">Conteúdo:</h3>
                <h3>{ch.content}</h3>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default RenderCharacters;
