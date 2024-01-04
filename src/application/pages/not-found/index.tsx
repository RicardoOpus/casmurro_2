import { Link } from 'react-router-dom';
import notfound from '../../../../public/images/not-found.png';
import './not-foundPage.css';

function NotFoundPage() {
  return (
    <div className="notFoundPage">
      <h1>Oops! Página não encontrada</h1>
      <h2>Desculpe, a página que você está procurando não existe.</h2>
      <img className="icon-color" src={notfound} alt="ilustração lupa" />
      <div className="notFounLink">
        <Link to="/">Voltar à página inicial</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
