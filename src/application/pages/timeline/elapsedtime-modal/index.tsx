import {
  ChangeEvent,
  useEffect, useRef, useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import utils from '../../../../service/utils';
import IWorld from '../../../../interfaces/IWorld';
import ICharacter from '../../../../interfaces/ICharacter';
import IManuscript from '../../../../interfaces/IManuscript';

interface ValidDateItem extends Required<IManuscript>, Required<IWorld>, Required<ICharacter> {
  date: string;
}

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  timeline: (ValidDateItem)[];
}

function ElapsedTimeModal({
  onClose, openModal, timeline,
}: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const handleCancel = () => onClose();
  const [isChecked, setIsChecked] = useState(true);
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [resultTime, setResultTime] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    if (key === 'date1') {
      setDate1(e.target.value);
    } else {
      setDate2(e.target.value);
    }
  };

  const calculateTime = () => {
    const timeValues = utils.calculateTimeElapsed(date1, date2);
    if (timeValues) {
      setResultTime(`Passaram-se ${timeValues.years} anos, ${timeValues.months} meses e ${timeValues.days} dias`);
    }
  };

  useEffect(() => {
    if (date1 && date2) {
      setIsChecked(false);
    } else {
      setIsChecked(true);
    }
  }, [date1, date2]);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
      setDate1('');
      setDate2('');
    }
  }, [openModal]);

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
        <h2>Calcular tempo entre datas</h2>
        <div style={{ marginTop: '1em' }} className="deadlineContainer">
          <div>
            <h3>Data 1</h3>
            <select
              value={date1}
              onChange={(e) => handleInputChange(e, 'date1')}
              style={{ color: 'var(--text-color-inactive)' }}
            >
              <option value="">-- selecione --</option>
              {timeline?.map((item) => (
                <option key={uuidv4()} value={item.date}>
                  {utils.convertDatePTBR(item.date)}
                  {' '}
                  -
                  {' '}
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3>Data 2</h3>
            <select
              value={date2}
              onChange={(e) => handleInputChange(e, 'date2')}
              style={{ color: 'var(--text-color-inactive)' }}
            >
              <option value="">-- selecione --</option>
              {timeline?.map((item) => (
                <option key={uuidv4()} value={item.date}>
                  {utils.convertDatePTBR(item.date)}
                  {' '}
                  -
                  {' '}
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <p>{resultTime}</p>
        </div>
        <div className="button-container">
          <button id="btnSavePr" disabled={isChecked} onClick={calculateTime} type="button">Calcular</button>
          <button onClick={handleCancel} type="button">Fechar</button>
        </div>
      </div>
    </dialog>
  );
}

export default ElapsedTimeModal;
