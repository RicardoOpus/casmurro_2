import { ChangeEvent, useEffect, useState } from 'react';
import './side-bar.css';
import { useSelector } from 'react-redux';
import IrootStateProject from '../../../domain/IrootStateProject';
import IWorld from '../../../domain/worldModel';
import ICharacter from '../../../domain/characterModel';
import CardInspect from './card-inspect';

function SideBar() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [showInspect, setShowInspect] = useState(false);
  const [allCards, setAllCards] = useState<(IWorld | ICharacter)[]>([]);
  const [filtredCards, setFiltredCards] = useState<(IWorld | ICharacter)[]>([]);
  const [selectedCard, setSelectedCar] = useState<IWorld | ICharacter>();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const sidebarWidth = isSidebarOpen ? 'block' : 'none';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const sideBarHandleClick = (value: IWorld | ICharacter) => {
    setSelectedCar(value);
    setShowInspect(true);
  };

  useEffect(() => {
    const array1 = projectData.data?.characters;
    const array2 = projectData.data?.world;
    if (array1 && array2) {
      const newArray = [...array1, ...array2];
      newArray.sort((a, b) => (b.last_edit || 0) - (a.last_edit || 0));
      setAllCards(newArray);
    }
  }, [projectData.data?.characters, projectData.data?.world]);

  useEffect(() => {
    const handleFilter = (cardList: IWorld[] | ICharacter[]) => {
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
    <div className="sideBar">
      <button className="btnDiscret sideBarButton" type="button" onClick={toggleSidebar}>
        {isSidebarOpen ? '❮❮' : '❯❯'}
      </button>

      <div className="sideBarContent" style={{ display: sidebarWidth }}>
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
            {showInspect ? (
              <div>
                <button onClick={() => setShowInspect(false)} className="btnSmall" type="button">Fechar</button>
                <CardInspect card={selectedCard} />
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
        )}
      </div>
    </div>
  );
}

export default SideBar;
