import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  showBirth: boolean;
  showDeath: boolean;
  showCharact: boolean;
  // eslint-disable-next-line no-unused-vars
  handleInputCheck: (e: boolean, key: string) => void;
}

function CharAddonsModal({
  onClose,
  openModal, showBirth, showDeath, showCharact, handleInputCheck,
}: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [showFieldBirth, setShowFieldBirth] = useState(showBirth);
  const [showFieldDeath, setShowFieldDeath] = useState(showDeath);
  const [showFieldChara, setshowFieldChara] = useState(showCharact);

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
        <div className="checkbox-wrapper">
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
        </div>
        <button onClick={onClose} type="button">Fechar</button>
      </div>
    </dialog>
  );
}

export default CharAddonsModal;
