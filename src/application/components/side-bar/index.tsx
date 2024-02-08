import {
  ChangeEvent, SyntheticEvent, useEffect, useState,
} from 'react';
import './side-bar.css';
import { useSelector } from 'react-redux';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import IrootStateProject from '../../../interfaces/IRootStateProject';
import IWorld from '../../../interfaces/IWorld';
import ICharacter from '../../../interfaces/ICharacter';
import CardInspect from './card-inspect';
import INotes from '../../../interfaces/INotes';
import IManuscript from '../../../interfaces/IManuscript';

function SideBar() {
  const [width, setWidth] = useState(500);
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [showInspect, setShowInspect] = useState(false);
  const [allCards, setAllCards] = useState<(IWorld | ICharacter | INotes | IManuscript)[]>([]);
  const [filtredCards, setFiltredCards] = useState<(IWorld | ICharacter |
    INotes | IManuscript)[]>([]);
  const [selectedCard, setSelectedCar] = useState<IWorld | ICharacter | INotes | IManuscript>();

  const onResize = (
    _e: SyntheticEvent<Element, Event>,
    data: ResizeCallbackData,
  ) => {
    if (data.size && Number(data.size.width) > 60) {
      setWidth(data.size.width);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setWidth(60);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    setWidth(500);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const sideBarHandleClick = (value: IWorld | ICharacter | INotes | IManuscript) => {
    setSelectedCar(value);
    setShowInspect(true);
  };

  useEffect(() => {
    const array1 = projectData.data?.characters;
    const array2 = projectData.data?.world;
    const array3 = projectData.data?.notes;
    const array4 = projectData.data?.manuscript;
    if (array1 && array2 && array3 && array4) {
      const newArray = [...array1, ...array2, ...array3, ...array4];
      newArray.sort((a, b) => (b.last_edit || 0) - (a.last_edit || 0));
      setAllCards(newArray);
    }
  }, [projectData.data?.characters,
    projectData.data?.manuscript, projectData.data?.notes, projectData.data?.world]);

  useEffect(() => {
    const handleFilter = () => {
      if (searchInput.startsWith('@')) {
        const filterType = searchInput.substring(1).toLowerCase();
        switch (filterType) {
          case 'char':
            setFiltredCards(projectData.data?.characters || []);
            break;
          case 'world':
            setFiltredCards(projectData.data?.world || []);
            break;
          case 'notes':
            setFiltredCards(projectData.data?.notes || []);
            break;
          case 'manu':
            setFiltredCards(projectData.data?.manuscript || []);
            break;
          default:
            setFiltredCards([]);
            break;
        }
      } else {
        const result = allCards.filter((card) => {
          const titleMatch = !searchInput || card.title.includes(searchInput);
          return titleMatch;
        });
        const limitedResult = result.slice(0, 10);
        setFiltredCards(limitedResult);
      }
    };

    handleFilter();
  }, [searchInput, projectData.data?.characters,
    projectData.data?.notes, allCards, projectData.data?.world, projectData.data?.manuscript]);

  return (
    <Resizable className="resizable" width={width} height={100} onResize={onResize} handle={<div className="custom-handle" />}>
      <div className="sideBar" style={{ width: `${width}px` }}>
        {isSidebarOpen ? (
          <button className="btnDiscret sideBarButton" type="button" onClick={closeSidebar}>
            ❮❮
          </button>
        ) : (
          <button className="btnDiscret sideBarButton" type="button" onClick={openSidebar}>
            ❯❯
          </button>
        )}
        <div className="sideBarContent">
          {isSidebarOpen && (
            <div>
              <h3 style={{ color: 'var(--text-color-inactive)' }}>Consulta rápida</h3>
              <input
                type="text"
                value={searchInput}
                placeholder="Pesquisar em tudo..."
                onChange={(e) => handleInputChange(e)}
                className="cardInputSearch"
              />
              <div className="inspectBottons">
                <button onClick={() => setShowInspect(false)} disabled={!showInspect} className="btnSmall" type="button">
                  <span className="ui-icon ui-icon-arrowreturnthick-1-w icon-color" />
                  Voltar
                </button>
                <button onClick={() => setSearchInput('')} className="btnSmall" type="button">✖ Limpar</button>
              </div>
              <div className="sideBarList">
                {showInspect ? (
                  <div>
                    {selectedCard && (
                      <CardInspect card={selectedCard} />
                    )}
                  </div>
                ) : (
                  filtredCards.map((e) => (
                    <div key={e.id}>
                      <button
                        className="btnInvisible"
                        type="button"
                        onClick={() => sideBarHandleClick(e)}
                      >
                        {e.title || 'sem nome'}
                        <br />
                        {' '}
                        <span className="spanSideBar">
                          (
                          {e.type}
                          )
                        </span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Resizable>
  );
}

export default SideBar;
