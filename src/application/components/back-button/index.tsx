import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <div>
      <button className="btnSmall" type="button" onClick={() => navigate(-1)}>
        <span className="ui-icon ui-icon-arrowreturnthick-1-w icon-color" />
        {' '}
        Voltar
      </button>
    </div>
  );
}

export default BackButton;
