import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  page: string;
}

function BackButton({ page }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <div>
      <button className="btnInvisible" type="button" onClick={() => navigate(page)}>
        <span className="ui-icon ui-icon-arrowreturnthick-1-w icon-color" />
        {' '}
        Voltar
      </button>
    </div>
  );
}

export default BackButton;
