import { useDispatch, useSelector } from 'react-redux';
import './world-list.css';
import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import IWorld from '../../../../interfaces/IWorld';
import NoData from '../../../components/no-dada';
import NotFound from '../../../components/not-found';
import utils from '../../../../service/utils';
import {
  worldFilterCategoryAction,
  worldFilterTitleAction,
  worldFilterSortAction,
  worldFilterSortActionDirection,
} from '../../../redux/actions/worldActions';
import worldService from '../../../../service/worldService';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';

type RootStateWorld = {
  worldFilterReducer: {
    selectedTitle: string,
    selectedCategory: string,
    isOrder: boolean,
    isAscOrder: boolean,
  }
};

function WorldList() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [worldItens, setWorldItens] = useState<IWorld[]>([]);
  const [filtredWorldItens, setfiltredWorldItens] = useState<IWorld[]>([]);
  const [isFilterClear, setisFilterClear] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    selectedTitle,
    selectedCategory,
    isOrder,
    isAscOrder,
  } = useSelector((state: RootStateWorld) => state.worldFilterReducer);

  const clearAllFilters = () => {
    dispatch(worldFilterTitleAction(''));
    dispatch(worldFilterCategoryAction(''));
    dispatch(worldFilterSortAction(false));
    setisFilterClear(true);
  };

  const handleSort = (direction: boolean) => {
    if (direction) {
      dispatch(worldFilterSortActionDirection(true));
    } else {
      dispatch(worldFilterSortActionDirection(false));
    }
    dispatch(worldFilterSortAction(true));
  };

  useEffect(() => {
    if (projectData.data?.world) {
      setWorldItens(projectData.data.world);
      setfiltredWorldItens(projectData.data.world);
    }
  }, [projectData.data?.world]);

  useEffect(() => {
    if (selectedTitle
      || selectedCategory
      || isOrder) {
      setisFilterClear(false);
    }
  }, [isOrder, selectedCategory, selectedTitle]);

  useEffect(() => {
    const handleFilter = (worldList: IWorld[]) => {
      const result = worldList.filter((world) => {
        const titleMatch = !selectedTitle || world.title.includes(selectedTitle);
        const categoryMatch = !selectedCategory || world.category === selectedCategory;
        return titleMatch && categoryMatch;
      });
      if (isOrder) {
        if (isAscOrder) {
          const sortedList = result.sort((a, b) => a.title.localeCompare(b.title));
          setfiltredWorldItens(sortedList);
        } else {
          const sortedList = result.sort((a, b) => a.title.localeCompare(b.title)).reverse();
          setfiltredWorldItens(sortedList);
        }
      } else {
        setfiltredWorldItens(result);
      }
    };
    handleFilter(worldItens);
  }, [worldItens, selectedTitle, selectedCategory, isAscOrder, dispatch, isOrder]);

  const changePosition = async (
    e: MouseEvent<HTMLButtonElement>,
    list: IWorld[],
    toUp: boolean,
    id: number,
  ) => {
    e.stopPropagation();
    const currentTask = list?.map((ele) => ele.id);
    const selectedI = currentTask?.indexOf(id) ?? -1;
    if (toUp && selectedI > 0 && list) {
      const newI = list;
      const swapIndex = selectedI - 1;
      [newI[swapIndex], newI[selectedI]] = [newI[selectedI], newI[swapIndex]];
      await worldService.upDatePosition(newI);
      dispatch(fetchProjectDataAction(true));
    } else if (!toUp && list && selectedI < list.length - 1) {
      const newI = list;
      const swapIndex = selectedI + 1;
      [newI[swapIndex], newI[selectedI]] = [newI[selectedI], newI[swapIndex]];
      await worldService.upDatePosition(newI);
      dispatch(fetchProjectDataAction(true));
    }
  };

  return (
    worldItens.length === 0 ? (
      <NoData dataType="itens mundo" />
    ) : (
      <div>
        <div className="filterBar">
          <input
            type="text"
            value={selectedTitle}
            placeholder="Pesquisar pelo título..."
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              dispatch(worldFilterTitleAction(target.value));
            }}
            className="cardInputSearch"
          />
          <select
            value={selectedCategory}
            onChange={(e) => dispatch(worldFilterCategoryAction(e.target.value))}
            style={{ color: 'var(--text-color-inactive)' }}
          >
            <option value="">Categoria</option>
            {prjSettings.worldCategory.map((e) => (
              <option key={e} value={e}>{`• ${e}`}</option>
            ))}
          </select>
          <button className="btnSmall" type="button" onClick={() => handleSort(true)}>↑ Az</button>
          <button className="btnSmall" type="button" onClick={() => handleSort(false)}>↓ Za</button>
          <button className="btnSmall" type="button" onClick={clearAllFilters}>✖ Filtros</button>
        </div>
        <div className="amountInfoBar">
          <h3>
            Total
            {' '}
            {filtredWorldItens.length}
            {' '}
            {!isFilterClear && <span>- Filtros aplicados</span>}
          </h3>
        </div>
        {filtredWorldItens.length === 0 ? (
          <NotFound />
        ) : (
          filtredWorldItens.map((worldItem) => (
            <button onClick={() => navigate(`/world/${worldItem.id}`)} key={worldItem.id} type="button" className="listItens">
              <div className="listCardWorld">
                <div className="titleCardSection">
                  <h3 className="cardListTitle">{worldItem.title}</h3>
                  {isFilterClear && (
                    <div style={{ display: 'flex', gap: '0.5em' }}>
                      <button onClick={(e) => changePosition(e, worldItens, true, worldItem.id)} className="btnSmall deleteButton" type="button">▲</button>
                      <button onClick={(e) => changePosition(e, worldItens, false, worldItem.id)} className="btnSmall deleteButton" type="button">▼</button>
                    </div>
                  )}
                </div>
                <hr />
                <div className="cardWorldInfos">
                  <div>
                    <p className="categoryListItem">
                      {worldItem.category}
                    </p>
                    <p>{utils.abreviarString(worldItem.resume, 300)}</p>
                  </div>
                  {worldItem.image ? (
                    <img className="worldListImage" src={worldItem.image} alt="card img" />
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    )
  );
}

export default WorldList;
