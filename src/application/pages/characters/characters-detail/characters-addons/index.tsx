import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import './characters-addons.css';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  showBirth: boolean;
  showDeath: boolean;
  showCharact: boolean;
  showFullName: boolean;
  showNotes: boolean;
  // eslint-disable-next-line no-unused-vars
  handleInputCheck: (e: boolean, key: string) => void;
}

function CharAddonsModal({
  onClose,
  openModal, showBirth, showDeath, showCharact, showFullName, showNotes, handleInputCheck,
}: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [showFieldBirth, setShowFieldBirth] = useState(showBirth);
  const [showFieldDeath, setShowFieldDeath] = useState(showDeath);
  const [showFieldChara, setshowFieldChara] = useState(showCharact);
  const [showFieldFull, setshowFieldFull] = useState(showFullName);
  const [showFieldNotes, setshowFieldNotes] = useState(showNotes);

  const handleInputType = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === 'birth') {
      setShowFieldBirth(e.target.checked);
      handleInputCheck(e.target.checked, 'showDate_birth');
    } if (type === 'death') {
      setShowFieldDeath(e.target.checked);
      handleInputCheck(e.target.checked, 'showDate_death');
    } if (type === 'char') {
      setshowFieldChara(e.target.checked);
      handleInputCheck(e.target.checked, 'showCharacteristics');
    } if (type === 'full') {
      setshowFieldFull(e.target.checked);
      handleInputCheck(e.target.checked, 'show_full_name');
    } if (type === 'notes') {
      setshowFieldNotes(e.target.checked);
      handleInputCheck(e.target.checked, 'show_notes');
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
                <label htmlFor="showFieldFull">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldFull"
                    checked={showFieldFull}
                    onChange={(e) => handleInputType(e, 'full')}
                  />
                  {' '}
                  Nome completo
                </label>
              </div>
              <div>
                <label htmlFor="showFieldBirth">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldBirth"
                    checked={showFieldBirth}
                    onChange={(e) => handleInputType(e, 'birth')}
                  />
                  {' '}
                  Data de nascimento
                </label>
              </div>
              <div>
                <label htmlFor="showFieldDeath">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldDeath"
                    checked={showFieldDeath}
                    onChange={(e) => handleInputType(e, 'death')}
                  />
                  {' '}
                  Data de falecimento
                </label>
              </div>
              <div>
                <label htmlFor="showFieldChara">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldChara"
                    checked={showFieldChara}
                    onChange={(e) => handleInputType(e, 'char')}
                  />
                  {' '}
                  Características física e psicológicas
                </label>
              </div>
              <div>
                <label htmlFor="showFieldNotes">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldNotes"
                    checked={showFieldNotes}
                    onChange={(e) => handleInputType(e, 'notes')}
                  />
                  {' '}
                  Anotações
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

export default CharAddonsModal;
