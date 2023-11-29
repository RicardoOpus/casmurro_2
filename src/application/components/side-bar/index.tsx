import {
  ChangeEvent, SyntheticEvent, useEffect, useState,
} from 'react';
import './side-bar.css';
import { useSelector } from 'react-redux';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import IrootStateProject from '../../../domain/IrootStateProject';
import IWorld from '../../../domain/worldModel';
import ICharacter from '../../../domain/characterModel';
import CardInspect from './card-inspect';
import INotes from '../../../domain/InotesModel';

function SideBar() {
  const [width, setWidth] = useState(600);
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [showInspect, setShowInspect] = useState(false);
  const [allCards, setAllCards] = useState<(IWorld | ICharacter | INotes)[]>([]);
  const [filtredCards, setFiltredCards] = useState<(IWorld | ICharacter | INotes)[]>([]);
  const [selectedCard, setSelectedCar] = useState<IWorld | ICharacter | INotes>();

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
    setWidth(600);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const sideBarHandleClick = (value: IWorld | ICharacter | INotes) => {
    setSelectedCar(value);
    setShowInspect(true);
  };

  useEffect(() => {
    const array1 = projectData.data?.characters;
    const array2 = projectData.data?.world;
    const array3 = projectData.data?.notes;
    if (array1 && array2 && array3) {
      const newArray = [...array1, ...array2, ...array3];
      newArray.sort((a, b) => (b.last_edit || 0) - (a.last_edit || 0));
      setAllCards(newArray);
    }
  }, [projectData.data?.characters, projectData.data?.notes, projectData.data?.world]);

  useEffect(() => {
    const handleFilter = (cardList: IWorld[] | ICharacter[] | INotes[]) => {
      const result = cardList.filter((card) => {
        const titleMatch = !searchInput || card.title.includes(searchInput);
        return titleMatch;
      });
      const limitedResult = result.slice(0, 10);
      setFiltredCards(limitedResult);
    };
    handleFilter(allCards);
  }, [allCards, searchInput]);

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
              <h3>Consulta rápida</h3>
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
                        {e.title}
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
