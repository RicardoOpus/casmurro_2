import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="innerContent">
      <div className="card">
        <h1>Esse é um h1</h1>
        <h2>Esse é um h2</h2>
        <h3>Esse é um h3</h3>
        <p>Isso é  um paragráfo comum</p>
        <a href="./">Essa é uma link</a>
        <button type="button" onClick={() => navigate('/dev')}>
          Botão padrão sem classe
        </button>
        <button className="btnDiscret" type="button">Botão discreto</button>
        <button className="btnMedium" type="button">botão M</button>
        <button className="btnSmall" type="button">botão P</button>
        <div>
          Inputs
          <input className="cardInput" type="text" placeholder="input text padrão" />
          <input className="cardInput" type="number" />
          <div className="checkbox-wrapper-2">
            <input className="sc-gJwTLC ikxBAC" type="checkbox" />
          </div>
          <input className="cardInputDate" type="date" name="" id="" />
          <select className="">
            <option value="">-- selecione --</option>
            <option value="">Opção 1</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
