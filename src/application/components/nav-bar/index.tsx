import './nav-bar.css';

function NavBar() {
  return (
    <div className="navBar">
      <button id="Dashboard" className="navBarItem" type="button">Dashboard</button>
      <div className="separator" />
      <button id="Personagens" className="navBarItem" type="button">Personagens</button>
      <div className="separator" />
      <button id="Mundo" className="navBarItem" type="button">Mundo</button>
      <div className="separator" />
      <button id="Rascunho" className="navBarItem" type="button">Rascunho</button>
      <div className="separator" />
      <button id="Timeline" className="navBarItem" type="button">Timeline</button>
      <div className="separator" />
      <button id="Notas" className="navBarItem" type="button">Notas</button>
      <div className="separator" />
      <button id="Sobre" className="navBarItem navBatItemEnd" type="button">Sobre</button>
    </div>
  );
}

export default NavBar;
