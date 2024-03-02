import { useDispatch, useSelector } from 'react-redux';
import './world-list.css';
import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import IWorld from '../../../../interfaces/IWorld';
import NoData from '../../../components/no-dada';
import NotFound from '../../../components/not-found';
import {
  worldFilterCategoryAction,
  worldFilterTitleAction,
  worldFilterSortAction,
  worldFilterSortActionDirection,
} from '../../../redux/actions/worldActions';
import worldService from '../../../../service/worldService';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import WorldSortble from './worldSortble';

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
  const [positionChagne, setPositionChange] = useState(false);
  const [isFilterClear, setisFilterClear] = useState(true);
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
      const selectedTitleLower = selectedTitle ? selectedTitle.toLowerCase() : '';
      const result = worldList.filter((world) => {
        const titleMatch = !selectedTitleLower
          || world.title.toLowerCase().includes(selectedTitleLower);
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

  const changePosition = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const activeIndex = filtredWorldItens.findIndex((item) => item.id === active.id);
      const overIndex = filtredWorldItens.findIndex((item) => item.id === over.id);
      if (activeIndex !== -1 && overIndex !== -1 && active.id !== over.id) {
        setWorldItens((items) => {
          const newItems = arrayMove(items, activeIndex, overIndex);
          return [...newItems];
        });
        setPositionChange(true);
      }
    }
  };

  useEffect(() => {
    if (positionChagne) {
      worldService.upDatePosition(worldItens);
      dispatch(fetchProjectDataAction(true));
      setPositionChange(false);
    }
  }, [dispatch, positionChagne, worldItens]);

  return (
    worldItens.length === 0 ? (
      <NoData dataType="itens mundo" />
    ) : (
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={changePosition}
        modifiers={[restrictToVerticalAxis]}
      >
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
          <button className="btnSmall" type="button" onClick={clearAllFilters} disabled={isFilterClear}>✖ Filtros</button>
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
          <SortableContext
            items={filtredWorldItens}
            strategy={verticalListSortingStrategy}
          >
            {
              filtredWorldItens.map((worldItem) => (
                <WorldSortble
                  id={worldItem.id}
                  title={worldItem.title}
                  image={worldItem.image}
                  category={worldItem.category}
                  resume={worldItem.resume}
                  hasFilter={isFilterClear}
                />
              ))
            }
          </SortableContext>
        )}
      </DndContext>
    )
  );
}

export default WorldList;
