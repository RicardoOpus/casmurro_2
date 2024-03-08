import { useNavigate } from 'react-router-dom';

type Props = {
  path: string;
  callback: () => void;
};

function BackButton({ path, callback }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path === 'back') {
      callback();
      navigate(-1);
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      <button className="btnSmall" type="button" onClick={handleClick}>
        <span className="ui-icon ui-icon-arrowreturnthick-1-w icon-color" />
        {' '}
        Voltar
      </button>
    </div>
  );
}

export default BackButton;
