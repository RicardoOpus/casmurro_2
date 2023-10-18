import { useNavigate } from "react-router-dom";

function TitleBar() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate('/')}>
        HOME
      </button>
      <button onClick={() => navigate('/projects')}>
        Projetos
      </button>
    </>
  )
}

export default TitleBar;
