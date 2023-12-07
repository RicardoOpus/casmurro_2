import {
  ChangeEvent,
  useEffect, useRef, useState,
} from 'react';

interface GenericModalProps {
  onClose: () => void;
  showTimer: () => void;
  openModal: boolean;
  // eslint-disable-next-line no-unused-vars
  updateTimer: (data: string) => void;
}

function TimerModal({
  onClose, showTimer, openModal, updateTimer,
}: GenericModalProps) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [, setCountDown] = useState('');
  const [, setSegundos] = useState(0);
  const ref = useRef<HTMLDialogElement | null>(null);

  const handleMinutesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMinutes = parseInt(event.target.value, 10);
    setMinutes(newMinutes);
  };

  const handleScondsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSeconds = parseInt(event.target.value, 10);
    setSeconds(newSeconds);
  };

  const startTimer = () => {
    showTimer();
    onClose();
    const totalSeconds = minutes * 60 + seconds;
    setSegundos(totalSeconds);
    const intervalId = setInterval(() => {
      setSegundos((prevSegundos) => {
        const minutosRestantes = Math.floor(prevSegundos / 60);
        const segundosRestantes = prevSegundos % 60;

        const minutosRestantesFormatado = minutosRestantes.toString().padStart(2, '0');
        const segundosRestantesFormatado = segundosRestantes.toString().padStart(2, '0');
        const elementTimer = `${minutosRestantesFormatado}:${segundosRestantesFormatado}`;
        setCountDown(elementTimer);
        updateTimer(elementTimer);
        if (prevSegundos > 0) {
          return prevSegundos - 1;
        }
        clearInterval(intervalId);
        updateTimer('00:00');
        return 0;
      });
    }, 1000);
  };

  const handleCancel = () => onClose();

  useEffect(() => {
    const handleEscapeKeyPress = (event: { key: string }) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKeyPress);
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, [onClose]);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-content">
        <h2>
          <div className="timerIcon" />
          {' '}
          Temporizador
        </h2>
        <div className="button-container">
          <h3>Minutos:</h3>
          <input
            type="number"
            className="cardInput"
            value={minutes}
            onChange={handleMinutesChange}
            style={{ width: '100px' }}
          />
          <h3>Segundos:</h3>
          <input
            type="number"
            className="cardInput"
            value={seconds}
            onChange={handleScondsChange}
            style={{ width: '100px' }}
          />
          <button onClick={startTimer} type="button" className="btnSmall">▶ Iniciar</button>
        </div>
        <button onClick={handleCancel} type="button">Fechar</button>
      </div>
    </dialog>
  );
}

export default TimerModal;
