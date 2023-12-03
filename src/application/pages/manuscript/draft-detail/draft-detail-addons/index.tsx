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
    if (type === 'date') {
      setshowFieldDate(e.target.checked);
      handleInputCheck(e.target.checked, 'show_date');
    } if (type === 'note') {
      setshowFieldNote(e.target.checked);
      handleInputCheck(e.target.checked, 'show_notes');
    } if (type === 'task') {
      setShowFieldTask(e.target.checked);
      handleInputCheck(e.target.checked, 'show_taskList');
    } if (type === 'time') {
      setshowFieldTime(e.target.checked);
      handleInputCheck(e.target.checked, 'show_time');
    } if (type === 'place') {
      setsshowFieldPlace(e.target.checked);
      handleInputCheck(e.target.checked, 'show_place');
    } if (type === 'weather') {
      setsshowFieldWeather(e.target.checked);
      handleInputCheck(e.target.checked, 'show_weather');
    } if (type === 'goalWC') {
      setsshowFieldGoalWC(e.target.checked);
      handleInputCheck(e.target.checked, 'show_goalWC');
    }
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
