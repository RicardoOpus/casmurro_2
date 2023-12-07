import { useEffect, useState } from 'react';
import Alert from '../../../../components/alert';

interface GenericModalProps {
  onClose: () => void;
  countDown: string;
}

function TimerDisplay({ onClose, countDown }: GenericModalProps) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const setAlert = () => {
      setTimeout(() => {
        setShowAlert(false);
        onClose();
      }, 5000);
    };
    if (countDown === '00:00') {
      setShowAlert(true);
      setAlert();
    }
  }, [countDown, onClose]);

  return (
    <div className="Timer">
      <div className="displayTimer">
        {countDown.startsWith('00') ? (
          <h3 style={{ color: 'red' }}>{countDown}</h3>
        ) : (
          <h3>{countDown}</h3>
        )}
      </div>
      <button className="btnCloseTimer" type="button" onClick={onClose}>✖</button>
      {showAlert && (
        <Alert mensage="Fim do tempo!" />
      )}
    </div>
  );
}

export default TimerDisplay;
