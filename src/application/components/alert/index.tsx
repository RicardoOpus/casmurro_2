import './alert.css';

interface GenericModalProps {
  mensage: string;
}

function Alert({ mensage }: GenericModalProps) {
  return (
    <div className="genericWarning">
      <p>{mensage}</p>
    </div>
  );
}

export default Alert;
