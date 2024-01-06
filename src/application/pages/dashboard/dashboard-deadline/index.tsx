import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  startDateProject: string;
  finishDateProject: string;
  // eslint-disable-next-line no-unused-vars
  updateDeadline: (date1: string, date2: string) => void;
}

function DeadlineModal({
  onClose, openModal,
  startDateProject, finishDateProject, updateDeadline,
}: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [startDate, setStartDate] = useState(startDateProject);
  const [finishDate, setFinishDate] = useState(finishDateProject);
  const handleCancel = () => onClose();

  const saveDeadline = () => {
    updateDeadline(startDate, finishDate);
    onClose();
  };

  const clearDeadline = () => {
    updateDeadline('', '');
    onClose();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    if (key === 'start') {
      setStartDate(e.target.value);
    } else {
      setFinishDate(e.target.value);
    }
  };

  useEffect(() => {
    if (startDate && finishDate) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [finishDate, startDate]);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
      setStartDate(startDateProject);
      setFinishDate(finishDateProject);
    }
  }, [finishDateProject, openModal, startDateProject]);

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

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-content">
        <h2>Definir prazo de conclusão</h2>
        <button className="btnSmall" onClick={clearDeadline} style={{ margin: '.5em 0' }} type="button" disabled={isDisabled}>Desativar prazo</button>
        <div className="deadlineContainer">
          <div>
            <h3>Data inicial:</h3>
            <input
              type="date"
              className="dashboardInputDate"
              value={startDate}
              onChange={(e) => handleInputChange(e, 'start')}
              name=""
              id=""
            />
          </div>
          <div>
            <h3>Data final</h3>
            <input
              type="date"
              className="dashboardInputDate"
              value={finishDate}
              onChange={(e) => handleInputChange(e, 'finish')}
              name=""
              id=""
            />
          </div>
        </div>
        <div className="button-container">
          <button id="btnSavePr" onClick={saveDeadline} type="button" disabled={isDisabled}>Salvar</button>
          <button onClick={handleCancel} type="button">Fechar</button>
        </div>
      </div>
    </dialog>
  );
}

export default DeadlineModal;
