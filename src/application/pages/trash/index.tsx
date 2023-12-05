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
import './trash.css';
import utils from '../../../service/utils';

function Trash() {
  const dispatch = useDispatch();
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [trashItens, setTrashItens] = useState<ICharacter[]
    | IWorld[] | INotes[] | IManuscript[]>([]);
  const [filtredTrashItens, setFiltredTrashItens] = useState<ICharacter[]
    | IWorld[] | INotes[] | IManuscript[]>([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isAscOrder, setIsAscOrdere] = useState(true);

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
      case 'Cena':
        await trashService.restoreManuscript(data as IManuscript);
        dispatch(fetchProjectDataAction(true));
        break;
      case 'Capítulo':
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

  const clearAllFilters = () => {
    setSelectedTitle('');
    setSelectedType('');
  };

  const handleSort = () => {
    const sortedList = [...filtredTrashItens].reverse();
    setFiltredTrashItens(sortedList);
    setIsAscOrdere(!isAscOrder);
  };

  useEffect(() => {
    if (projectData.data?.trash) {
      setTrashItens(projectData.data.trash);
      setFiltredTrashItens(projectData.data.trash);
    }
  }, [projectData.data?.trash]);

  useEffect(() => {
    const handleFilter = (trashList: ICharacter[]) => {
      const result = trashList.filter((trash) => {
        const titleMatch = !selectedTitle || trash.title.includes(selectedTitle);
        const categoryMatch = !selectedType || trash.type === selectedType;
        return titleMatch && categoryMatch;
      });
      if (!isAscOrder) {
        const sortedList = [...result].reverse();
        setFiltredTrashItens(sortedList);
      } else {
        setFiltredTrashItens(result);
      }
    };
    handleFilter(trashItens);
  }, [trashItens,
    selectedTitle, selectedType, isAscOrder]);

  return (
    trashItens.length === 0 ? (
      <NoData dataType="notas" />
    ) : (
      <div className="innerContent">
        <div className="card">
          <div>
            <h1>Lixeira</h1>
            <div className="filterBar">
              <input
                type="text"
                value={selectedTitle}
                placeholder="Pesquisar pelo título..."
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  setSelectedTitle(target.value);
                }}
                className="cardInputSearch"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ color: 'var(--text-color-inactive)' }}
              >
                <option value="" disabled>-- Tipo --</option>
                <option value="Personagem">Personagem</option>
                <option value="Mundo">Mundo</option>
                <option value="Cena">Cena</option>
                <option value="Capítulo">Capítulo</option>
              </select>
              <button className="btnSmall" type="button" onClick={clearAllFilters}>✖ Filtros</button>
              <button className="btnSmall" type="button" onClick={handleSort} disabled={isAscOrder}>↑</button>
              <button className="btnSmall" type="button" onClick={handleSort} disabled={!isAscOrder}>↓</button>
            </div>
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
                    <td>{utils.abreviarString(e.resume, 50)}</td>
                    <td>{utils.abreviarString(e.content, 100)}</td>
                    <td>
                      <button type="button" className="btnSmall" onClick={() => handleRestore(e, e.type)}>
                        Restaurar
                      </button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button type="button" className="removeRelationBtn" onClick={() => deleteForever(e.id)}>
                        ✖
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  );
}

export default Trash;
