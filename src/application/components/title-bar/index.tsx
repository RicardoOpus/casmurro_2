import { useNavigate } from 'react-router-dom';

function TitleBar() {
  const navigate = useNavigate();

  return (
    <>
      <button type="button" onClick={() => navigate('/')}>
        HOME
      </button>
      <button type="button" onClick={() => navigate('/projects')}>
        Projetos
      </button>
    </>
  );
}

export default TitleBar;
