import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import IrootStateProject from '../../../domain/IrootStateProject';
import ICharacter from '../../../domain/characterModel';
import IWorld from '../../../domain/worldModel';
import IManuscript from '../../../domain/IManuscript';
import INotes from '../../../domain/InotesModel';
import NoData from '../../components/no-dada';
import NotFound from '../not-found';
import trashService from '../../../service/trashService';
import { fetchProjectDataAction } from '../../redux/actions/projectActions';

function Trash() {
  const dispatch = useDispatch();
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [trashItens, setTrashItens] = useState<ICharacter[]
    | IWorld[] | INotes[] | IManuscript[]>([]);
  const [filtredTrashItens, setFiltredTrashItens] = useState<ICharacter[]
    | IWorld[] | INotes[] | IManuscript[]>([]);

  const handleRestore = async (data: INotes | IManuscript, type: string) => {
    switch (type) {
      case 'Personagem':
        await trashService.restoreCharacter(data);
        dispatch(fetchProjectDataAction(true));
        break;
      case 'Mundo':
        await trashService.restoreWorld(data);
        dispatch(fetchProjectDataAction(true));
        break;
      case 'Notas':
        await trashService.restoreNote(data);
        dispatch(fetchProjectDataAction(true));
        break;
      case 'Cena' || 'Capítulo':
        await trashService.restoreManuscript(data as IManuscript);
        dispatch(fetchProjectDataAction(true));
        break;
      default:
        break;
    }
  };

  const deleteForever = async (id: number) => {
    await trashService.deleteTotal(id);
    dispatch(fetchProjectDataAction(true));
  };

  useEffect(() => {
    if (projectData.data?.trash) {
      setTrashItens(projectData.data.trash);
      setFiltredTrashItens(projectData.data.trash);
    }
  }, [projectData.data?.trash]);

  return (
    trashItens.length === 0 ? (
      <NoData dataType="notas" />
    ) : (
      <div>
        <div>
          <h1>Trash</h1>
        </div>
        {filtredTrashItens.length === 0 ? (
          <NotFound />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Resumo</th>
                <th>Conteúdo</th>
                <th>Ação</th>
                <th>Deletar</th>
              </tr>
            </thead>
            <tbody>
              {filtredTrashItens.map((e) => (
                <tr key={e.id}>
                  <td>{e.title}</td>
                  <td>{e.type}</td>
                  <td>{e.resume}</td>
                  <td>{e.content}</td>
                  <td>
                    <button type="button" className="btnSmall" onClick={() => handleRestore(e, e.type)}>
                      Restaurar
                    </button>
                  </td>
                  <td>
                    <button type="button" className="btnSmall" onClick={() => deleteForever(e.id)}>
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  );
}

export default Trash;
