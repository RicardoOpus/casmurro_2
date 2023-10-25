import { useNavigate } from 'react-router-dom';
import './title-bar.css';

function TitleBar() {
  const navigate = useNavigate();

  return (
    <div id="main-header" className="header">
      <div className="logoTitle">
        <img src="./casmurro-logo.svg" alt="logo Casmurro" width="170px" />
      </div>
      <div className="separator" />
      <button className="btnPorjects" type="button" onClick={() => navigate('/projects')}>Projetos</button>
      <div className="header-right">
        <span id="backup" />
        <button type="button">Fazer backup</button>
      </div>
    </div>
  );
}

export default TitleBar;
