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
import HelpModal from '../help-modal';

function SideBar() {
  const [width, setWidth] = useState(500);
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [showInspect, setShowInspect] = useState(false);
  const [lockInput, setlockInput] = useState(false);
  const [disableClear, setDisableClear] = useState(true);
  const [modal, setModal] = useState(false);
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
    setlockInput(true);
  };

  const handleBackButton = () => {
    setShowInspect(false);
    setlockInput(false);
  };

  const handleClear = () => {
    handleBackButton();
    setSearchInput('');
  };

  useEffect(() => {
    if (searchInput === '') {
      setDisableClear(true);
    } else {
      setDisableClear(false);
    }
  }, [searchInput]);

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
    projectData.data?.manuscript,
    projectData.data?.notes, projectData.data?.world]);

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
          const titleMatch = !searchInput
            || card.title.toLowerCase().includes(searchInput.toLowerCase());
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
      <div className="sideBar" style={{ width: `${width}px`, minWidth: isSidebarOpen ? '290px' : '' }}>
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
              <div className="sidebarTitle">
                <h3 style={{ color: 'var(--text-color-inactive)' }}>Consulta rápida</h3>
                <button onClick={() => setModal(true)} className="help" type="button">?</button>
              </div>
              <input
                type="text"
                value={searchInput}
                disabled={lockInput}
                placeholder="Pesquisar em tudo..."
                onChange={(e) => handleInputChange(e)}
                className="cardInputSearch"
              />
              <div className="inspectBottons">
                <button onClick={handleBackButton} disabled={!showInspect} className="btnSmall" type="button">
                  <span className="ui-icon ui-icon-arrowreturnthick-1-w icon-color" />
                  Voltar
                </button>
                <button disabled={disableClear} onClick={handleClear} className="btnSmall" type="button">✖ Limpar</button>
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
                        className="sideBarItemList"
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
        <HelpModal
          openModal={modal}
          onClose={() => setModal(false)}
          title="Ajuda - Consulta rápida"
          mensage="<p>Pesquise por cartões sem sair da tela atual. Digite o título do cartão, ou utilize o indicador '@ + tipo' para mostrar todos os cartões de um tipo.</p><p>Exemplos:</p><p>@char - mostra todos os personagens</p><p>@world - mostra todos itens mundo</p><p>@notes - mostra todas as notas</p><p>@manu - mostra todas as cenas</p>"
        />
      </div>
    </Resizable>
  );
}

export default SideBar;
