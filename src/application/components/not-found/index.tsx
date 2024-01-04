import notfound from '../../../../public/images/not-found.png';
import './not-found.css';

function NotFound() {
  return (
    <div className="dataNotFoundComp">
      <h2>Nada encontrado...</h2>
      <img className="icon-color" src={notfound} alt="ilustração lupa" />
    </div>
  );
}

export default NotFound;
