import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  showDate: boolean;
  showTime: boolean;
  showPlace: boolean;
  showWeather: boolean;
  showGoalWC: boolean;
  showNote: boolean;
  showtaskList: boolean;
  // eslint-disable-next-line no-unused-vars
  handleInputCheck: (e: boolean, key: string) => void;
}

function DraftAddonsModal({
  onClose,
  openModal, showDate, showNote, showtaskList, showTime,
  showPlace, showWeather, showGoalWC, handleInputCheck,
}: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [showFieldDate, setshowFieldDate] = useState(showDate);
  const [showFieldTime, setshowFieldTime] = useState(showTime);
  const [showFieldPlace, setsshowFieldPlace] = useState(showPlace);
  const [showFieldWeather, setsshowFieldWeather] = useState(showWeather);
  const [showFieldGoalWC, setsshowFieldGoalWC] = useState(showGoalWC);
  const [showFieldNote, setshowFieldNote] = useState(showNote);
  const [showFieldTask, setShowFieldTask] = useState(showtaskList);

  const handleInputType = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    let showField;
    let inputType;
    switch (type) {
      case 'date':
        showField = setshowFieldDate;
        inputType = 'show_date';
        break;
      case 'note':
        showField = setshowFieldNote;
        inputType = 'show_notes';
        break;
      case 'task':
        showField = setShowFieldTask;
        inputType = 'show_taskList';
        break;
      case 'time':
        showField = setshowFieldTime;
        inputType = 'show_time';
        break;
      case 'place':
        showField = setsshowFieldPlace;
        inputType = 'show_place';
        break;
      case 'weather':
        showField = setsshowFieldWeather;
        inputType = 'show_weather';
        break;
      case 'goalWC':
        showField = setsshowFieldGoalWC;
        inputType = 'show_goalWC';
        break;
      default:
        return;
    }
    showField(e.target.checked);
    handleInputCheck(e.target.checked, inputType);
  };

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
        <h2>Adicionar campos extras</h2>
        <div className="addonsChar">
          <div className="addonsCharE">
            <div className="checkbox-wrapper">
              <div>
                <label htmlFor="showFieldDate">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldDate"
                    checked={showFieldDate}
                    onChange={(e) => handleInputType(e, 'date')}
                  />
                  {' '}
                  Data
                </label>
              </div>
              <div>
                <label htmlFor="showFieldTime">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldTime"
                    checked={showFieldTime}
                    onChange={(e) => handleInputType(e, 'time')}
                  />
                  {' '}
                  Hora
                </label>
              </div>
              <div>
                <label htmlFor="showFieldPlace">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldPlace"
                    checked={showFieldPlace}
                    onChange={(e) => handleInputType(e, 'place')}
                  />
                  {' '}
                  Local
                </label>
              </div>
              <div>
                <label htmlFor="showFieldWeather">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldWeather"
                    checked={showFieldWeather}
                    onChange={(e) => handleInputType(e, 'weather')}
                  />
                  {' '}
                  Clima
                </label>
              </div>
              <div>
                <label htmlFor="showFieldGoalWC">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldGoalWC"
                    checked={showFieldGoalWC}
                    onChange={(e) => handleInputType(e, 'goalWC')}
                  />
                  {' '}
                  Meta de palavras
                </label>
              </div>
              <div>
                <label htmlFor="showFieldNote">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldNote"
                    checked={showFieldNote}
                    onChange={(e) => handleInputType(e, 'note')}
                  />
                  {' '}
                  Anotações
                </label>
              </div>
              <div>
                <label htmlFor="showFieldTask">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldTask"
                    checked={showFieldTask}
                    onChange={(e) => handleInputType(e, 'task')}
                  />
                  {' '}
                  Lista de tarefas
                </label>
              </div>
            </div>
          </div>
        </div>
        <button onClick={onClose} type="button">Fechar</button>
      </div>
    </dialog>
  );
}

export default DraftAddonsModal;
