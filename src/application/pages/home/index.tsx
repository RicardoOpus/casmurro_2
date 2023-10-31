import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StartChecks from '../../../service/startChecks';

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const checkProjects = async () => {
      const startVerify = new StartChecks();
      if (!(await startVerify.hasProjects())) { navigate('/projects'); }
    };
    checkProjects();
  }, [navigate]);

  return (
    <div className="innerContent">
      <div className="dinamic">
        <div className="card">
          <h1>Esse é um h1</h1>
          <h2>Esse é um h2</h2>
          <h3>Esse é um h3</h3>
          <p>Isso é  um paragráfo comum</p>
          <a href="#">Essa é uma link</a>
          <button type="button" onClick={() => navigate('/dev')}>
            Botão padrão sem classe
          </button>
          <button>Botão discreto</button>
          <button>botão </button>
          <div>
            Inputs
            <input type="text" placeholder="input text padrão" />
            <input type="number" />
            <input type="checkbox" />
            <input type="date" name="" id="" />
            <select>
              <option value="">-- selecione --</option>
              <option value="">Opção 1</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
