import { useDispatch, useSelector } from 'react-redux';
import './world-list.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IrootStateProject from '../../../../domain/IrootStateProject';
import IWorld from '../../../../domain/worldModel';
import NoData from '../../../components/no-dada';
import NotFound from '../../../components/not-found';
import utils from '../../../../service/utils';
import { worldFilterCategoryAction, worldFilterSortAction, worldFilterTitleAction } from '../../../redux/actions/worldActions';

type RootStateWorld = {
  worldFilterReducer: {
    selectedTitle: string,
    selectedCategory: string,
    isAscOrder: boolean,
  }
};

function WorldList() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [worldItens, setWorldItens] = useState<IWorld[]>([]);
  const [filtredWorldItens, setfiltredWorldItens] = useState<IWorld[]>([]);
  const [, setClearFilters] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    selectedTitle,
    selectedCategory,
    isAscOrder,
  } = useSelector((state: RootStateWorld) => state.worldFilterReducer);

  const clearAllFilters = () => {
    dispatch(worldFilterTitleAction(''));
    dispatch(worldFilterCategoryAction(''));
    setClearFilters(true);
  };

  const handleSort = () => {
    const sortedList = [...filtredWorldItens].reverse();
    setfiltredWorldItens(sortedList);
    dispatch(worldFilterSortAction(!isAscOrder));
  };

  useEffect(() => {
    if (projectData.data?.world) {
      setWorldItens(projectData.data.world);
      setfiltredWorldItens(projectData.data.world);
    }
  }, [projectData.data?.world]);

  useEffect(() => {
    const handleFilter = (worldList: IWorld[]) => {
      const result = worldList.filter((world) => {
        const titleMatch = !selectedTitle || world.title.includes(selectedTitle);
        const categoryMatch = !selectedCategory || world.category === selectedCategory;
        return titleMatch && categoryMatch;
      });
      if (!isAscOrder) {
        const sortedList = [...result].reverse();
        setfiltredWorldItens(sortedList);
        dispatch(worldFilterSortAction(isAscOrder));
      } else {
        setfiltredWorldItens(result);
      }
    };
    handleFilter(worldItens);
  }, [worldItens,
    selectedTitle, selectedCategory, isAscOrder, dispatch]);

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
          <button className="btnSmall" type="button" onClick={clearAllFilters}>✖ Filtros</button>
          <button className="btnSmall" type="button" onClick={handleSort} disabled={isAscOrder}>↑ Az</button>
          <button className="btnSmall" type="button" onClick={handleSort} disabled={!isAscOrder}>↓ Za</button>
        </div>
        <div className="amountInfoBar">
          <h3>
            Total
            {' '}
            {filtredWorldItens.length}
          </h3>
        </div>
        {filtredWorldItens.length === 0 ? (
          <NotFound />
        ) : (
          filtredWorldItens.map((worldItem) => (
            <button onClick={() => navigate(`/world/${worldItem.id}`)} key={worldItem.id} type="button" className="listItens">
              <div className="listCardWorld">
                <h3 className="cardListTitle">{worldItem.title}</h3>
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
